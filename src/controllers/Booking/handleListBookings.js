const Booking = require('../../model/Booking')


const handleListBookings = async (req, res) => {
    const currentUser = req.user;
    if(!currentUser) return res.status(401).json({message : "Session Expired"});
    const bookings = await Booking.find({customerEmail: currentUser});
    const customerBookings = bookings.flatMap(booking => booking.customerBookings)
    res.json(customerBookings);
}

module.exports = handleListBookings