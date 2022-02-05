const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { reqString } = require('./dbUtils');

const paymentIntentSchema = new Schema({
    bookingId : {
        type : String,
        required : true,
        unique : true,
    },
    paymentIntent : reqString
})

module.exports = mongoose.model('PaymentIntent', paymentIntentSchema)