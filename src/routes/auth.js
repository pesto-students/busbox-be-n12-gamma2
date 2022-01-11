const express = require('express')
const path = require('path')
const router = express.Router();
const authController = require('../controllers/Auth/authController');

// router for /auth

router.post('/signup', authController.handleSignUp);
router.post('/login', authController.handleLogin);
router.post('/logout', authController.handleLogOut);
router.post('/refresh', authController.handleRefresh)

module.exports = router;


