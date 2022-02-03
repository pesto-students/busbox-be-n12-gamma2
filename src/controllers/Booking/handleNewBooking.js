const uuid = require('uuid').v4;
const stripe = require('stripe')(process.env.STRIPE_SECRETE_API_KEY);
const Bus = require('../../model/Bus'); ;
const Booking = require('../../model/Booking');
const bookingUtils = require('./bookingUtils');
const PaymentIntent = require('../../model/PaymentIntent');
const mongoose = require('mongoose');
const redis = require('../../configs/redis');

const handleNewBooking = async (req, res) => {
  try {
      const currentCustomer = req.user;
      if(!currentCustomer) return res.sendStatus(403)

      const { busId, busType, selectedSeats, sourceCity, destinationCity, journeyDate,
        pickupLocation, dropLocation, passengerDetails, contactDetails
      } = req.body;

      const foundBus = await Bus.findOne({busId}).exec();
      if(!foundBus) {
        return res.status(400).json({message: "Invalid busId", busId});
      }
      const sourceCityInBusRoute = foundBus.busRoute?.find(route => route.cityName === sourceCity)
      const destinationCityInBusRoute = foundBus.busRoute?.find(route => route.cityName === destinationCity)
      const sourceStopNumber = sourceCityInBusRoute?.stopNumber;
      const destinationStopNumber = destinationCityInBusRoute?.stopNumber;
      if(!sourceStopNumber || !destinationStopNumber || sourceStopNumber > destinationStopNumber){
        return res.status(400).json({message : "Invalid Route", sourceCity, destinationCity});
      }

      if(!bookingUtils.areSelectedSeatsAvailable(busId, journeyDate, selectedSeats)){
        return res.status(503).json({message : "At least one of the selected seat is no longer available", selectedSeats});
      }

      const allSeatsValid = selectedSeats.length === selectedSeats.filter(seat => Number.isInteger(seat) && seat > 0 && seat <= foundBus.numberOfSeats).length
      if(!allSeatsValid){
        return res.status(400).json({message : 'Invalid seat numbers', selectedSeats})
      }

      const totalFare =
        (foundBus.priceFromOriginToEnd / foundBus.busRoute.length) *
        (destinationStopNumber-sourceStopNumber) *
        (selectedSeats.length);

      
      const newBooking = { bookingId : uuid(), bookingStatus : "BOOKING_SUCCESSFUL",
        busId, busType, bookedSeats: selectedSeats, totalFare, sourceCity: sourceCityInBusRoute, 
        destinationCity: destinationCityInBusRoute, journeyDate, pickupLocation, dropLocation, 
        passengerDetails, contactDetails
      }

      const mongooseSession = await mongoose.startSession();
      try {
        await mongooseSession.startTransaction();
        await bookingUtils.lockSelectedSeats(selectedSeats, busId, newBooking.bookingId, journeyDate, mongooseSession);
        // store the new booking in redis untill payment succeeds or 10 mins elapse.
        const client = await redis.getClient();
        await client.setEx(newBooking.bookingId, 900, JSON.stringify(newBooking));

        const sessionObject = bookingUtils.getSessionObject({
          email: currentCustomer,
          bookingId: newBooking.bookingId,
          busType: foundBus.busType,
          selectedSeats,
          totalFare
        })

        const session = await stripe.checkout.sessions.create(sessionObject)

        await PaymentIntent.create([{
          bookingId: newBooking.bookingId,
          paymentIntent : session.payment_intent
        }], {session: mongooseSession})

        await mongooseSession.commitTransaction();
        res.json({url : session.url});
      } catch(err){
        await mongooseSession.abortTransaction();
        console.log('a', {...err}, err);
        if(err.code === 11000) {
          return res.status(503).json({message : "Selected seats are not available at the moment, please try again in 10 mins."});
        }
        res.status(500).json({message : err.message, from : "hello"})
      } finally {
        mongooseSession.endSession();
      }
  } catch (err) {
    console.error('b',{...err}, err);
    if(err.code === 11000) {
      return res.status(503).json({message : "Selected seats are not available at the moment, please try again in 10 mins."});
    }
    res.status(500).json({message: err.message, from : 'world'});
  }
}


module.exports = handleNewBooking;