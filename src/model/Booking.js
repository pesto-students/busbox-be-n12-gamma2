const mongoose = require('mongoose')
const dbUtils = require('./dbUtils')
const commonSchema = require('./CommonSchema')

const Schema = mongoose.Schema

const passengerSchema = new Schema({
    passengerName : dbUtils.reqString,
    passengerAge : dbUtils.reqNumber,
    gender : dbUtils.reqString,
})

const bookingSchema = new Schema({
    bookingId : dbUtils.reqString, 
    busId : dbUtils.reqString,
    bookedSeats : [commonSchema.seatStatusSchema],
    totalFare : dbUtils.reqNumber,
    sourceCity : dbUtils.reqString,
    destinationCity : dbUtils.reqString,
    journeyDate : dbUtils.reqString,
    pickUpLocation : commonSchema.locationSchema,
    dropLocation : commonSchema.locationSchema,
    passengerDetails : [passengerSchema],
    customerEmail : dbUtils.reqString,
    bookingEmail : dbUtils.reqString,
    bookingPhone : dbUtils.reqString,
})

module.exports = mongoose.model('Booking', bookingSchema)