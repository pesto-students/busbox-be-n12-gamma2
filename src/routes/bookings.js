const express = require('express')
const path = require('path')
const router = express.Router();

// router for /bookings

//     handle following routes here

// TODO :: POST    /bookings/new 
// TODO :: GET     /bookings/list
// TODO :: GET     /bookings/:bookingId
// TODO :: POST    /bookings/mail
// TODO :: POST    /bookings/cancel/initiate
// TODO :: POST    /bookings/cancel


router.get('/', (req, res) => res.send("Bookings Router"));

module.exports = router;