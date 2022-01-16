const SeatLock = require('../../model/SeatLock')
const moment = require('moment')
const mongoose = require('mongoose')

const sendBadRequest = (res, message) => {
  res.status(400).json({message})
}

const verifyBookingParams = (req, res, next) => {
    let 
      { busId,
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
      if (!selectedSeats) return sendBadRequest(res, "missing required number array selectedSeats")
      if (!sourceCity) return sendBadRequest(res, "missing required string sourceCity")
      if (!destinationCity) return sendBadRequest(res, "missing requiredString destinationCity")
      if (!journeyDate || !(moment(journeyDate, "DD/MM/YYYY", true).isValid())) return sendBadRequest(res, "missing required date('DD/MM/YYYY') journeyDate")
      if (!pickupLocation) return sendBadRequest(res, "missing pickupLocation")
      if (!dropLocation) return sendBadRequest(res, "missing dropLocation")
      if (!passengerDetails) return sendBadRequest(res, "missing passenger details")
      if (!contactDetails) return sendBadRequest(res, "missing contact details")
      if (!isValidLocation(pickupLocation) ) return sendBadRequest(res, `invalid pickup location :  ${pickupLocation}`)
      if (!isValidLocation(dropLocation)) return sendBadRequest(res, `invalid drop location : ${dropLocation}`)
      if (!isValidPassenger(passengerDetails)) return sendBadRequest(res, `invalid passenger details ${passengerDetails}`)
      if (!isValidContact(contactDetails)) return sendBadRequest(res, `invalid contactDetails ${contactDetails}`)
      if (selectedSeats.map(isValidSeat).includes(false)) return sendBadRequest(res, `selected seats are invalid ${selectedSeats}`)
      
      next();
  }

const isValidSeat = seat => {
   return !(!seat || (seat <= 0 && seat >= 45))
}

const isValidLocation = location => {
    const {address, departureTime} = location;
    return !(!address || !departureTime)
}

const isValidPassenger = passenger => {
    const {name, age, gender} = passenger
    return !((!name || !age || !gender) && (age <= 0 && age >= 100))
}

const isValidContact = contact => {
    const {email, phone} = contact;
    return !(!email || !phone)
}

const areSelectedSeatsAvailable = (selected, actual) => {
    const statuses = selected.map(selectedSeatNumber => {
      const currentSeat = actual.find(seat => seat.seatNumber === selectedSeatNumber)
      return currentSeat?.status?.toLowerCase() === "available"
    })
    return !statuses.includes(false);
}

const lockSelectedSeats = async (seats, busId, bookingId, journeyDate) => {
  const locks = seats.map(seat => ({
      bookingId,
      seat : `${busId}:${journeyDate}:${seat.seatNumber}`
    }))

  const session = await mongoose.startSession();
  const result = await session.withTransaction(() => {
    return SeatLock.create(locks, {session});
  });
  return result || false;
}

module.exports = {
  verifyBookingParams,
  areSelectedSeatsAvailable,
  lockSelectedSeats
};