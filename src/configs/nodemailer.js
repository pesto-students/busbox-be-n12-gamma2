const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secureConnection: false,
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
    },
    requireTLS: true,
    tls:{
        ciphers:'SSLv3'
    }
})

const getSendOtpOptions = (to, otp) => {
    return {
        from : process.env.NODE_MAILER_EMAIL,
        to,
        subject: "BusBox OTP Confirmation",
        text: `Please use this OTP to confirm your ticket cancellation, This OTP will expire in 5 minuites.\n\n\n ${otp}`
    }
}

const getEmailVerificationOptions = (to, otp) => {
    return {
        from : process.env.NODE_MAILER_EMAIL,
        to,
        subject: "BusBox OTP Confirmation",
        text: `Please use this OTP to confirm your email, This OTP will expire in 5 minuites.\n\n\n ${otp}`
    }
}

const getSendTicketOptions = (to, filename) => {
    return {
        from : process.env.NODE_MAILER_EMAIL,
        to,
        subject: "BusBox Ticket",
        text: 'Your ticket is attached to this email.',
        attachments: [{
            filename : 'ticket.pdf',
            path: filename,
            contentType: 'application/pdf'
        }]
    }
}

const sendOtpOnEmail = async (to, otp) => {
    const options = getSendOtpOptions(to, otp);
    return transporter.sendMail(options);
}

const sendTicketOnEmail = async (to, filename) => {
    console.log('send called', to, filename);
    const options = getSendTicketOptions(to, filename);
    return transporter.sendMail(options);
}

const sendEmailVerificationCode = async (to, otp) => {
    const options = getEmailVerificationOptions(to, otp);
    return transporter.sendMail(options)
}

module.exports = {
    sendOtpOnEmail,
    sendTicketOnEmail,
    sendEmailVerificationCode
};