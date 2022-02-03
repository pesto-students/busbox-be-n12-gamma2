const redis = require('../../configs/redis')
const Booking = require('../../model/Booking');
const PaymentIntent = require('../../model/PaymentIntent');
const stripe = require('stripe')(process.env.STRIPE_SECRETE_API_KEY)
const mongoose = require('mongoose')

const handleConfirmCancel = async (req, res) => {
    const user = req.user;
    if(!user) return res.sendStatus(401);
    const {bookingId, otp} = req.body;
    if(!bookingId) return res.status(400).json({message : "missing required param bookingID : String"})
    if(!otp) return res.status(400).json({message : "missing required param otp : String"})

    const cancelBooking = () => {
        return Booking.findOneAndUpdate(
            {'customerEmail' : user},
            {'$set' : {'customerBookings.$[elemX].bookingStatus': "CANCELLED"}},
            {arrayFilters: [{'elemX.bookingId' : bookingId}], returnDocument:'after'}
        ).exec();
    }
    redis.getClient()
        .then(client => client.get(bookingId))
        .then(validOtp => new Promise((resolve, reject) => {
                if (otp === validOtp) resolve(otp)
                else reject("Invalid Otp")
            })
        ).then(otp => PaymentIntent.findOne({bookingId}))
        .then(({paymentIntent}) => stripe.refunds.create({ payment_intent : paymentIntent }))
        .then(refundObject => cancelBooking()
        ).then(document => {
            res.json(document)
        }).catch(async err => {
            if(err.code === 'charge_already_refunded'){
                const result = await cancelBooking()
                return res.json({message: 'Booking cancelled successfully'});
            } else if(err === "Invalid Otp") {
                return res.status(406).json({message : "Invalid OTP"})
            } else {
                console.log(err, {...err});
                res.status(500).json(err)
            }
        })
}

module.exports = handleConfirmCancel

