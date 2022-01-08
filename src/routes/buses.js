const express = require('express')
const path = require('path')
const router = express.Router();

// router for /buses

// handle following routes here
// /buses/list
// /buses/:busId


router.get('/', (req, res) => res.send("Buses Router"));

module.exports = router;