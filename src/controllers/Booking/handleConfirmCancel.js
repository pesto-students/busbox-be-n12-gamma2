const redis = require('../../configs/redis')
const Booking = require('../../model/Booking');
const PaymentIntent = require('../../model/PaymentIntent');
const stripe = require('stripe')(process.env.STRIPE_SECRETE_API_KEY)

const handleConfirmCancel = async (req, res) => {
    const user = req.user;
    if(!user) return res.sendStatus(401);
    const {bookingId, otp} = req.body;
    if(!bookingId) return res.status(400).json({message : "missing required param bookingID"})
    redis.getClient()
        .then(client => client.get(bookingId))
        .then(validOtp => new Promise((resolve, reject) => {
                if (otp === validOtp) resolve(otp)
                else reject("Invalid Otp")
            })
        ).then(otp => PaymentIntent.findOne({bookingId}))
        .then(({paymentIntent}) => stripe.refunds.create({ payment_intent : paymentIntent }))
        .then(refundObject => 
            Booking.findOneAndUpdate(
                {customerEmail : user},
                {'$pull' : {'customerBookings' : {bookingId}}}
            )
        ).then(document => res.json(document))
        .catch(err => {
            console.log(err);
            if(err === "Invalid Otp") return res.status(406).json({message : "Invalid OTP"})
            else {
                console.log(err);
                res.status(500).json(err)
            }
        })
}

module.exports = handleConfirmCancel

