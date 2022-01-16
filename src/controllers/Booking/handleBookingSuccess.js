const mongoose = require('mongoose')
const Bus = require('../../model/Bus')
const Booking = require('../../model/Booking')

const handleBookingSuccess = async (req, res) => {
    const {bookingId} = req.params;
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        const bookingObject = await Booking.findOneAndUpdate(
            {'customerBookings.bookingId' : bookingId}, 
            { '$set' : { "customerBookings.$.bookingStatus":"BOOKING_SUCCESSFUL"} }, {session, returnDocument:'after'}
        ).exec();

        if(!bookingObject){
            throw new Error(`findAndUpdate booking failed id : ${bookingId}`)
        } 
        const customerBookings = bookingObject.customerBookings;
        const currentBooking = customerBookings.filter(booking => booking.bookingId === bookingId)[0];

        const bookedSeats = currentBooking.bookedSeats.map(seat => seat.seatNumber);
        const updatedBusStatus = await Bus.updateOne(
            {busId: currentBooking.busId},
            {'$set' : {'seatStatuses.$[elemX].status': "Booked"}},
            {arrayFilters: [{'elemX.seatNumber' : {'$in': bookedSeats}}], session, returnDocument:'after'}
        ).exec();

        await session.commitTransaction()
        res.json(currentBooking);
        if(!currentBooking){
            return res.status(500).json({message : "Internal Error, DB failure, Booking Not Found"});
        }

    } catch (e) {
        await session.abortTransaction();
        res.json({message : e.message})
        console.error(e);
    } finally {
        session.endSession();
    }
}

module.exports = handleBookingSuccess;