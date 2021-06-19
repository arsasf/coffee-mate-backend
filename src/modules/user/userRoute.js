const express = require('express')
const Route = express.Router()
const uploadFile = require('../../middlewares/uploads')

const userController = require('./userController')

Route.get(
  '/',
  userController.getDataAll)
Route.get(
  '/by-id/:id',
  userController.getDataById)
Route.patch(
  '/img/:id',
  uploadFile,
  userController.updateImage)
Route.patch(
  '/ling/lung/:id',
  uploadFile,
  // authMiddleware.authentication,
  // redisMiddleware.clearDataUserId,
  userController.updateData
)

module.exports = Route
