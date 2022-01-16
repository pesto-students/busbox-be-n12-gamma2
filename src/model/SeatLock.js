const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const seatLockSchema = new Schema({
    seat : {
        type: String,
        required: true,
        unique: true
    },
    bookingId : {
        type: String,
        required: true
    }
}, {timestamps:true});


seatLockSchema.index({createdAt: 1},{expireAfterSeconds: 600})

module.exports = mongoose.model('SeatLock', seatLockSchema)