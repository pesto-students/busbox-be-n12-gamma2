const mongoose = require('mongoose')
const Booking = require('../../model/Booking')
const SeatLock = require('../../model/SeatLock')


const handleBookingFailure = async (req, res) => {
    const {bookingId} = req.params;
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        await SeatLock.deleteMany({bookingId},{session}).exec();
        await Booking.updateOne({bookingId},{
            bookingStatus: "PAYMENT_VERFICATION_FAILED"
        }, {session})
        await session.commitTransaction()
        res.redirect(301, `${process.env.FRONTEND_URL}/booking-failed/`)
    } catch(e){
        await session.abortTransaction();
        res.redirect(301, `${process.env.FRONTEND_URL}/something-went-wrong/`)
    } finally {
        session.endSession();
    }
}

module.exports = handleBookingFailure;