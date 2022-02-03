const Booking = require('../../model/Booking')

const handleGetBooking = async (req, res) => {
    const user = req.user;
    if(!user){
        return res.sendStatus(401);
    }
    const {bookingId} = req.params;
    if(!bookingId){
        return res.status(400).json({message: 'Missing required param bookingId'})
    }
    const foundBooking = await Booking.findOne({customerEmail : user}).exec()
    if(!foundBooking){
        return res.status(404).json({message: `No booking found with id: ${bookingId}`});
    }
    res.json(foundBooking.toObject());
}

module.exports = handleGetBooking;