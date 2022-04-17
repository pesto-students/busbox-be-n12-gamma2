const nodemailer = require('../../configs/nodemailer');
const redis = require('../../configs/redis')
const User = require('../../model/User')

const get6RandomNumbers = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

const handleVerifyEmail = async (req, res) => {
    const {email} = req.body;

    if(!email) return res.status(400).json({
        message : "missing required param eamil : string"
    });

    const duplicate = await User.findOne({email}).exec()
    if(duplicate) return res.sendStatus(409) // Conflict


    const otp = get6RandomNumbers();

    const client = await redis.getClient();
    client.setEx(email, 900, otp.toString())
        .then(() => nodemailer.sendEmailVerificationCode(email, otp))
        .then(() => res.sendStatus(204))
        .catch(err => { 
            console.log(err, {...err});
            res.sendStatus(503)
        })
}

module.exports = handleVerifyEmail;