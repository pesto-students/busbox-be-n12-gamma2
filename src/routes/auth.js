const express = require('express')
const path = require('path')
const router = express.Router()
const authController = require('../controllers/Auth/authController')

// router for /auth

router.post('/signup', authController.handleSignUp)
router.post('/login', authController.handleLogin)
router.post('/logout', authController.handleLogOut)
router.post('/verify-email', authController.handleVerifyEmail)
router.post('/refresh', authController.handleRefresh)
router.post('/google-login', authController.handleGoogleLogin)

module.exports = router


