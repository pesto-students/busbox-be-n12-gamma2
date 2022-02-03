const express = require('express')
const router = express.Router()
const bookingsController = require('../controllers/Booking/bookingsController')
const ticketController = require('../controllers/Ticket/ticketController')
const verifyJWT = require('../middleware/verifyJWT')

router.get('/send',             verifyJWT, ticketController.handleSendEmail)
router.get('/download',         verifyJWT, ticketController.handleDownload)

router.post('/new',             verifyJWT, bookingsController.verifyBookingParams, bookingsController.handleNewBooking)
router.post('/cancel/initiate', verifyJWT, bookingsController.handleInitiateCancel)
router.post('/cancel/confirm',  verifyJWT, bookingsController.handleConfirmCancel)
router.get('/list',             verifyJWT, bookingsController.handleListBookings)
router.get('/:bookingId',       verifyJWT, bookingsController.handleGetBooking)

router.get('/success/:bookingId/:email', bookingsController.handleBookingSuccess)
router.get('/cancel/:bookingId/:email', bookingsController.handleBookingFailure)

module.exports = router
