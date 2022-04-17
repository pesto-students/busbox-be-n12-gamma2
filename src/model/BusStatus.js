const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const dbUtils = require('./dbUtils');
const commonSchema = require('./CommonSchema')
const moment = require('moment');

const busStatusSchema = new Schema({
    busId : dbUtils.reqString,
    date: {...dbUtils.reqString},
    ttlDate: mongoose.Schema.Types.Date,
    bookedSeats: [commonSchema.seatStatusSchema]
})

busStatusSchema.index({ttlDate: 1},{expireAfterSeconds: 86400})
busStatusSchema.index({busId: 1, date: 1}, {unique: 1})
module.exports = mongoose.model('BusStatus', busStatusSchema)
