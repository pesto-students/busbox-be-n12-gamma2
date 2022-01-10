const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbUtils = require('./dbUtils')

const busRouteSchema = new Schema({
    cityName : dbUtils.reqString,
    cityId : dbUtils.reqString,
    stopNumber: dbUtils.reqNumber,
    departureTime : dbUtils.reqString
})

const seatStatusSchema = new Schema({
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

const busSchema = new Schema({
    busId : dbUtils.reqString,
    busType : dbUtils.reqString,
    numberOfStops : dbUtils.reqNumber,
    priceFromOriginToEnd : dbUtils.reqNumber,
    numberOfSeats : dbUtils.reqNumber,
    seatLayout : dbUtils.reqString,     // 2X2 / 2X1
    aminities : [String],
    busRoute : [busRouteSchema],
    ratings : ratingsSchema,
    seatStatuses : [seatStatusSchema],
    runningDays : {
        type : [String],
        required : true
    }
})

module.exports = mongoose.model('Bus', busSchema);
