const mongoose = require('mongoose')
const dbUtils = require('./dbUtils')
const commonSchema = require('./CommonSchema')
const Schema = mongoose.Schema

const seatLayoutSchema = new Schema ({
    numberOfDecks : dbUtils.reqNumber,
    seatsOnLeft : dbUtils.reqNumber,
    seatsOnRight : dbUtils.reqNumber,
    numberOfRows : dbUtils.reqNumber,
    reservedForLadiesSeats : [dbUtils.reqNumber]
})

const busSchema = new Schema({
    busId : {...dbUtils.reqString, unique:true},
    busType : dbUtils.reqString,
    priceFromOriginToEnd : dbUtils.reqNumber,
    numberOfSeats : dbUtils.reqNumber,
    seatLayout : seatLayoutSchema,
    aminities : [String],
    busRoute : [commonSchema.busRouteSchema],
    ratings : commonSchema.ratingsSchema,
    isSleeper: {type: Boolean, required: true},
    runningDays : {
        type : [String],
        required : true
    }
})

module.exports = mongoose.model('Bus', busSchema)
