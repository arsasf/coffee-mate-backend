const authController = require('./authController')
const express = require('express')
const Route = express.Router()
// const uploadFile = require('../../middleware/uploads')

Route.post('/account/verify/:id', authController.verificationUser)
Route.post('/register', authController.register)
Route.post('/login', authController.login)
Route.post('/req-otp', authController.reqOtp)
Route.patch('/reset-password', authController.resetPassword)

module.exports = Route
