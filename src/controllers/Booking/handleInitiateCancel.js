const nodemailer = require('../../configs/nodemailer');
const redis = require('../../configs/redis')

const get6RandomNumbers = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

const handleInitiateCancel = async (req, res) => {
    const user = req.user;
    if(!user) return res.sendStatus(401);

    const {bookingId} = req.body;
    if(!bookingId) return res.status(400).json({
        message : "missing required param bookingId"
    });

    const otp = get6RandomNumbers();

    const client = await redis.getClient();
    client.setEx(bookingId, 900, otp.toString())
        .then(() => nodemailer.sendOtpOnEmail(user, otp))
        .then(() => res.sendStatus(204))
        .catch(err => { 
            console.log(err, {...err});
            res.sendStatus(503)
        })
}

module.exports = handleInitiateCancel;