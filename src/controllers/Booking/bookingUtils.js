const SeatLock = require('../../model/SeatLock')
const moment = require('moment')
const PaymentIntent = require('../../model/PaymentIntent')
const stripe = require('stripe')(process.env.STRIPE_SECRETE_API_KEY)
const BusStatus = require('../../model/BusStatus');

const sendBadRequest = (res, message) => {
  res.status(400).json({message})
}

const verifyBookingParams = (req, res, next) => {
    let 
      { busId,
        busType,
        selectedSeats,
        sourceCity,
        destinationCity,
        journeyDate,
        pickupLocation,
        dropLocation,
        passengerDetails,
        contactDetails
      } = req.body;

      if (!busId) return sendBadRequest(res, "missing required string busId")
      if (!busType) return sendBadRequest(res, "missing required string busType")
      if (!selectedSeats) return sendBadRequest(res, "missing required number array selectedSeats")
      if (!sourceCity) return sendBadRequest(res, "missing required string sourceCity")
      if (!destinationCity) return sendBadRequest(res, "missing requiredString destinationCity")
      if (!journeyDate || !(moment(journeyDate, "DD/MM/YYYY", true).isValid())) return sendBadRequest(res, "missing required date('DD/MM/YYYY') journeyDate")
      if (!pickupLocation) return sendBadRequest(res, "missing pickupLocation")
      if (!dropLocation) return sendBadRequest(res, "missing dropLocation")
      if (!passengerDetails) return sendBadRequest(res, "missing passenger details")
      if (!contactDetails) return sendBadRequest(res, "missing contact details")
      if (passengerDetails.map(isValidPassenger).includes(false)) return sendBadRequest(res, `invalid passenger details ${passengerDetails}`)
      if (!isValidContact(contactDetails)) return sendBadRequest(res, `invalid contactDetails ${contactDetails}`)
      if (selectedSeats.map(isValidSeat).includes(false)) return sendBadRequest(res, `selected seats are invalid ${selectedSeats}`)
      
      next();
  }

const isValidSeat = seat => {
   return Number.isInteger(seat) && seat > 0 && seat < 45
}

// const isValidLocation = location => {
//     const {address, departureTime} = location;
//     return !(!address || !departureTime)
//     TODO :: handle this from database
// }

const isValidPassenger = passenger => {
    const {name, age, gender} = passenger
    return !((!name || !age || !gender) && (age <= 0 && age >= 100))
}

const isValidContact = contact => {
    const {email, phone} = contact;
    return !(!email || !phone)
}

const areSelectedSeatsAvailable = async (busId, date, selected) => {
  const ttlDate = moment(date, 'DD/MM/YYYY');
  const busStatus = await BusStatus.findOne({busId, date}).exec();
  if(!busStatus){
    await BusStatus.create([{busId,date,ttlDate, bookedSeats:[]}])
    return true;
  }
  const bookedSeats = busStatus.bookedSeats;
  const conflict = bookedSeats.filter(bookedSeat => selected.includes(bookedSeat.seatNumber));
  return (!(conflict.length > 0))
}

const lockSelectedSeats = async (seats, busId, bookingId, journeyDate, session) => {
  const locks = seats.map(seat => ({
      bookingId,
      seat : `${busId}:${journeyDate}:${seat}`
    }))

  const result = await SeatLock.create(locks, {session});
  return result || false;
}

const getSessionObject = ({email, bookingId, busType, selectedSeats, totalFare}) => (
  {
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email : email,
    success_url: `${process.env.SERVER_URL}/bookings/success/${bookingId}/${email}`,
    cancel_url: `${process.env.SERVER_URL}/bookings/cancel/${bookingId}/${email}`,
    line_items: [
      { price_data: {
          currency : 'inr',
          product_data: {
            name : busType,
            description : `Seats : ${selectedSeats.join(', ')}`
          }, 
          unit_amount: (totalFare*100)
        }
      , quantity:1
      }
    ]
  }
)

const initiateRefund = (bookingId) => {
  return PaymentIntent.findOne({bookingId})
    .then(({paymentIntent}) => stripe.refunds.create({ payment_intent : paymentIntent }))
}



module.exports = {
  verifyBookingParams,
  areSelectedSeatsAvailable,
  lockSelectedSeats,
  initiateRefund,
  getSessionObject
};