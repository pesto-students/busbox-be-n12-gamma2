const express = require('express')
const router = express.Router()
const bookingsController = require('../controllers/Booking/bookingsController')
const verifyJWT = require('../middleware/verifyJWT')


router.post('/new', verifyJWT, bookingsController.verifyBookingParams, bookingsController.handleNewBooking)
router.post('/cancel/initiate', verifyJWT, bookingsController.handleInitiateCancel)
router.post('/cancel/confirm', verifyJWT, bookingsController.handleConfirmCancel)

router.get('/success/:bookingId', bookingsController.handleBookingSuccess)
router.get('/cancel/:bookingId', bookingsController.handleBookingFailure)
router.get('/list', verifyJWT, bookingsController.handleListBookings)
module.exports = router