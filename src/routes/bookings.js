const express = require('express')
const path = require('path')
const router = express.Router();

// router for /bookings


//     handle following routes here

// POST    /bookings/new 
// GET     /bookings/list
// GET     /bookings/:bookingId
// POST    /bookings/mail
// POST    /bookings/cancel/initiate
// POST    /bookings/cancel


router.get('/', (req, res) => res.send("Bookings Router"));

module.exports = router;