const express = require('express')
const Route = express.Router()
const uploadFile = require('../../middlewares/uploads')
const cartController = require('./cartController')
const authMiddleware = require('../../middlewares/auth')

Route.get(
  '/',
  cartController.getDataAll)
// Route.get(
//   '/by-id/:id',
//   cartController.getDataById
// )
Route.get(
  '/by-id-user/:id',
  authMiddleware.authentication,
  cartController.getDataByIdUser
)
// Route.patch(
//   '/img/:id',
//   uploadFile,
//   cartController.updateImage)
Route.post(
  '/',
  uploadFile,
  authMiddleware.authentication,
  cartController.postCart)

module.exports = Route
