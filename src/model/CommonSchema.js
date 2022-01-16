const mongoose = require('mongoose')
const Schema = mongoose.Schema
const dbUtils = require('./dbUtils')

const busRouteSchema = new Schema({
    cityName : dbUtils.reqString,
    cityId : dbUtils.reqString,
    stopNumber: dbUtils.reqNumber,
    departureTime : dbUtils.reqString
})

const seatStatusSchema = new Schema({
    seatType : dbUtils.reqString,
    seatNumber : dbUtils.reqNumber,
    status : dbUtils.reqString,
    from : Number,
    to : Number,
    reservedFor : String
})

const ratingsSchema = new Schema({
    rating : dbUtils.reqNumber,
    totalRatings : dbUtils.reqNumber
})

const locationSchema = new Schema({
    locationName : dbUtils.reqString,
    address : dbUtils.reqString,
    departureTime : dbUtils.reqString
})

module.exports = {
    busRouteSchema,
    seatStatusSchema,
    ratingsSchema,
    locationSchema
}