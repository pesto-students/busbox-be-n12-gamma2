const mongoose = require('mongoose')
const dbUtils = require('./dbUtils')
const commonSchema = require('./CommonSchema')

const Schema = mongoose.Schema

const passengerSchema = new Schema({
    name : dbUtils.reqString,
    age : dbUtils.reqNumber,
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
    busType: dbUtils.reqString,
    bookedSeats : [dbUtils.reqNumber],
    totalFare : dbUtils.reqNumber,
    sourceCity : commonSchema.busRouteSchema,
    destinationCity : commonSchema.busRouteSchema,
    bookingDate : dbUtils.reqString,
    journeyDate : dbUtils.reqString,
    pickupLocation : dbUtils.reqString,  //commonSchema.locationSchema, TODO :: Handle this by adding departure time in DB
    dropLocation : dbUtils.reqString,  //commonSchema.locationSchema, TODO :: Handle this by adding departure time in DB
    passengerDetails : [passengerSchema],
    contactDetails : contactDetailsSchema
}, {timestamps: true})

const bookingSchema = new Schema({
    customerEmail : {
        type: String,
        required: true,
        unique: true
    },
    customerBookings : [bookingDetailsSchema]
})

module.exports = mongoose.model('Booking', bookingSchema)