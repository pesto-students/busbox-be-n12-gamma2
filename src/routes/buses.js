const express = require('express')
const router = express.Router();
const Bus = require('../model/Bus')
const busController = require ('../controllers/busController')
// router for /buses

// handle following routes here
// /buses/list
// /buses/:busId

router.get('/list', busController.getBuses);
router.get('/locations', busController.getLocations)
module.exports = router;
