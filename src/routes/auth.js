const express = require('express')
const path = require('path')
const router = express.Router();
const authController = require('../controllers/authController');


// router for /auth

// handle following routes here
// POST /auth/login
// POST /auth/signup
// POST /auth/logout
// POST /auth/refresh



router.post('/signup', authController.handleSignUp);
router.post('/login', authController.handleLogIn);
router.post('/logout', authController.handleLogOut);
router.post('/refresh', authController.handleRefresh)

module.exports = router;


