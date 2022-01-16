const mongoose = require('mongoose')
const dbUtils = require('./dbUtils')
const commonSchema = require('./CommonSchema')
const Schema = mongoose.Schema

const busSchema = new Schema({
    busId : dbUtils.reqString,
    busType : dbUtils.reqString,
    priceFromOriginToEnd : dbUtils.reqNumber,
    numberOfSeats : dbUtils.reqNumber,
    seatLayout : dbUtils.reqString,     // 2X2 / 2X1
    aminities : [String],
    busRoute : [commonSchema.busRouteSchema],
    ratings : commonSchema.ratingsSchema,
    seatStatuses : [commonSchema.seatStatusSchema],
    runningDays : {
        type : [String],
        required : true
    }
})

module.exports = mongoose.model('Bus', busSchema)
