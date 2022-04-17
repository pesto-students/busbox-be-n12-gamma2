const Booking = require('../../model/Booking')


const handleListBookings = async (req, res) => {
    const currentUser = req.user;
    if(!currentUser) return res.status(401).json({message : "Session Expired"});
    const bookings = await Booking.findOne({customerEmail: currentUser});
    res.json(bookings.customerBookings);
}

module.exports = handleListBookings