const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD
    }
})

const getOptions = (to, otp) => {
    return {
        from : process.env.NODE_MAILER_EMAIL,
        to,
        subject: "BusBox OTP Confirmation",
        text: `Please use this OTP to confirm your ticket cancellation, This OTP will expire in 5 minuites.\n\n\n ${otp}`
    }
}

const sendOtpOnEmail = async (to, otp) => {
    const options = getOptions(to, otp);
    return transporter.sendMail(options);
}

module.exports = {sendOtpOnEmail};