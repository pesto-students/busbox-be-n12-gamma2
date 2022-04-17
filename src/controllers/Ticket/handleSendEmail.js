const fs = require('fs');
const pdf = require('html-pdf')
const template = require('./template')
const nodemailer = require('../../configs/nodemailer')

const handleSendBooking = (req, res, next) => {
    try {
        const user = req.user;
        if(!user) return next();
        const data = req.query;
        const bookingId = data.bookingId;
        if(!bookingId){
            return res.status(400).json({message: 'Missing required param bookingId : String'});
        }
        let details = data.details;
        if(!details) {
            return res.status(400).json({message : 'Missing required param details : [String]'})
        }
        details = data.details.map(str => JSON.parse(str))
        const htmlstr = template(details);
        const path = `./tickets/${bookingId}.pdf`;
        pdf.create(htmlstr).toFile(path, (err, result) => {
            if(err){
                res.status(500).json({message: err.message})
            }
            nodemailer.sendTicketOnEmail(user, path).then(result =>{
                res.sendStatus(204);
            }).catch(e => {
                console.error(e, {...e});
                res.status(500).json({message: 'send email failed.'});
            })
        })
    } catch (err) {
        console.error(err, {...err});
    }
}

module.exports = handleSendBooking;