const express = require('express')
const router = express.Router()
const busController = require ('../controllers/Bus/busController')

// router for /buses

router.get('/list', busController.handleListBuses)
router.get('/locations', busController.handleGetLocations)
router.get('/status', busController.handleGetBusStatus)
module.exports = router
