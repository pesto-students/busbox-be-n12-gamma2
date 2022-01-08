const express = require('express')
const path = require('path')
const router = express.Router();

// router for /auth

// handle following routes here
//POST /auth/login
//POST /auth/signup
//POST /auth/logout
router.get('/', (req, res) => res.send("Auth Router"));

module.exports = router;