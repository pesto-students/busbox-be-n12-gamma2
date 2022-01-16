const uuid = require('uuid').v4
const stripe = require('stripe')(process.env.STRIPE_SECRETE_API_KEY)
const Bus = require('../../model/Bus'); 
const Booking = require('../../model/Booking')
const bookingUtils = require('./bookingUtils')
const PaymentIntent = require('../../model/PaymentIntent')

const handleNewBooking = async (req, res) => {
  try {
  const currentCustomer = req.user;
  if(!currentCustomer) return res.sendStatus(403)

  const { busId,
    selectedSeats,
    sourceCity,
    destinationCity,
    journeyDate,
    pickupLocation,
    dropLocation,
    passengerDetails,
    contactDetails
  } = req.body;

  const foundBus = await Bus.findOne({busId}).exec();
  if(!foundBus) {
    return res.status(400).json({message: "Invalid busId", busId});
  }
  const sourceStopNumber = foundBus.busRoute?.find(route => route.cityName === sourceCity)?.stopNumber;
  const destinationStopNumber = foundBus.busRoute?.find(route => route.cityName === destinationCity)?.stopNumber;
  if(!sourceStopNumber || !destinationStopNumber || sourceStopNumber > destinationStopNumber){
    return res.status(400).json({message : "Invalid Route", sourceCity, destinationCity});
  }

  if(!bookingUtils.areSelectedSeatsAvailable(selectedSeats, foundBus.seatStatuses)){
    return res.status(503).json({message : "At least one of the selected seat is no longer available", selectedSeats});
  }

  const selected = foundBus.seatStatuses.filter(seat => selectedSeats.includes(seat.seatNumber))
  if(!selected || selected.length <= 0){
    return res.status(400).json({message : 'Invalid seat numbers', selectedSeats})
  }
  
  const totalFare = (foundBus.priceFromOriginToEnd / foundBus.busRoute.length) * (destinationStopNumber-sourceStopNumber) * (selected.length);
  
  const newBooking = {
    bookingId : uuid(),
    bookingStatus : "PENDING_PAYMENT_VERIFICATION",
    busId,
    bookedSeats: selected,
    totalFare,
    sourceCity,
    destinationCity,
    journeyDate,
    pickupLocation,
    dropLocation,
    passengerDetails,
    contactDetails
  }
  
  const locked = await bookingUtils.lockSelectedSeats(selected, busId, newBooking.bookingId, journeyDate);

  if(!locked) {
    return res.status(503).json({message : "Selected seats are not available at the moment, please try again in 10 mins.", selectedSeats});
  }

  const result = await Booking.updateOne(
    { customerEmail: currentCustomer },
    { $push: {customerBookings: newBooking}},
    { upsert: true}
  ).exec();

  if(!result) {
    return res.status(500).json({error : "database failure"});
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email : contactDetails.email,
      success_url: `${process.env.SERVER_URL}/bookings/success/${newBooking.bookingId}`,
      cancel_url: `${process.env.SERVER_URL}/bookings/cancel/${newBooking.bookingId}`,
      line_items: [
        { price_data: {
            currency : 'inr',
            product_data: {
              name : foundBus.busType,
              description : `Seats : ${selectedSeats.toString().replaceAll(',' , ', ')}`
            }, 
            unit_amount: (totalFare*100)
          }
        , quantity:1
        }
      ]
    })

    PaymentIntent.create({
      bookingId: newBooking.bookingId,
      paymentIntent : session.payment_intent
    }).then(intent => {
      console.log(session);
      res.json({url : session.url});
    })
  } catch(e){
    res.status(500).json({message : e.message})
  }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}


module.exports = handleNewBooking;