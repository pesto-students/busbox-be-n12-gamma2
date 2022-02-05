const mongoose = require('mongoose')
const BusStatus = require('../../model/BusStatus')
const Booking = require('../../model/Booking')
const redis = require('../../configs/redis')
const moment = require('moment');
const PaymentIntent = require('../../model/PaymentIntent');
const stripe = require('stripe')(process.env.STRIPE_SECRETE_API_KEY)

const handleBookingSuccess = async (req, res) => {
    const {bookingId, email} = req.params;
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        const client = await redis.getClient();
        let newBooking = await client.get(bookingId);
        newBooking = JSON.parse(newBooking);
        
        await Booking.updateOne(
            { customerEmail: email},
            { $push: {customerBookings: newBooking}},
            { upsert: true, session}
          ).exec();
        const bookedSeats = newBooking.bookedSeats.map(
            seatNumber => ({
                seatNumber, 
                status : 'Booked', 
                from: newBooking.sourceCity.stopNumber,
                to: newBooking.destinationCity.stopNumber
            })
        ) 
        console.log(bookedSeats);
        const result = await BusStatus.updateOne(
            {busId: newBooking.busId, date: newBooking.journeyDate},
            {$push: {bookedSeats: {$each: bookedSeats}}},
            {session, upsert: true}
        ).exec();
        console.log(result);
        await session.commitTransaction()
        res.redirect(301, `${process.env.FRONTEND_URL}/bookings/details/${bookingId}`);
    } catch (e) {
        await session.abortTransaction();
        PaymentIntent.findOne({bookingId}).then(({paymentIntent}) => {
            stripe.refunds.create({ payment_intent : paymentIntent })
        })
        const message = 'Aww Snap.., \n Booking Failed, any amount debited from your account will be refunded shortly.'
        res.redirect(301, `${process.env.FRONTEND_URL}/error/${bookingId}/${message}`);
        console.error(e, {...e});
    } finally {
        session.endSession();
    }
}

module.exports = handleBookingSuccess;