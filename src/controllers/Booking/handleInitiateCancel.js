const nodemailer = require('../../configs/nodemailer');
const redis = require('../../configs/redis')

const get6RandomNumbers = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

const handleInitiateCancel = async (req, res) => {
    // generate a random 6 digit integer
    const {bookingId} = req.body;
    if(!bookingId) return res.status(400).json({message : "missing required param bookingId"});

    const user = req.user;
    if(!user) return res.sendStatus(401);

    const otp = get6RandomNumbers();

    const client = await redis.getClient();
    client.setEx(bookingId, 3600, otp.toString())
        .then(result => nodemailer.sendOtpOnEmail("patilgajanan8485@gmail.com", otp))
        .then(result => res.sendStatus(204))
        .catch(err => { 
            console.log(err);
            res.sendStatus(503)
        })
}

module.exports = handleInitiateCancel;