const mongoose = require('mongoose')
const dbUtils = require('./dbUtils')
const commonSchema = require('./CommonSchema')

const Schema = mongoose.Schema

const passengerSchema = new Schema({
    passengerName : dbUtils.reqString,
    passengerAge : dbUtils.reqNumber,
    gender : dbUtils.reqString,
})

const contactDetailsSchema = new Schema({
    email : dbUtils.reqString,
    phone : dbUtils.reqString
})

const bookingDetailsSchema = new Schema({
    bookingId : dbUtils.reqString,
    bookingStatus : dbUtils.reqString,
    busId : dbUtils.reqString,
    bookedSeats : [commonSchema.seatStatusSchema],
    totalFare : dbUtils.reqNumber,
    sourceCity : dbUtils.reqString,
    destinationCity : dbUtils.reqString,
    bookingDate : dbUtils.reqString,
    journeyDate : dbUtils.reqString,
    pickUpLocation : commonSchema.locationSchema,
    dropLocation : commonSchema.locationSchema,
    passengerDetails : [passengerSchema],
    contactDetails : contactDetailsSchema
})

const bookingSchema = new Schema({
    customerEmail : {
        type: String,
        required: true,
        unique: true
    },
    customerBookings : [bookingDetailsSchema]
})

module.exports = mongoose.model('Booking', bookingSchema)