const express = require('express')
const Route = express.Router()
const uploadFile = require('../../middlewares/uploads')
const { authentication } = require('../../middlewares/auth')
const userController = require('./userController')
const redisMiddleware = require('../../middlewares/redis')

Route.get(userController.getDataAll)

Route.get(
  '/by-id/:id',
  redisMiddleware.getProductByIdRedis,
  userController.getDataById
)

Route.patch('/img/:id', authentication, uploadFile, userController.updateImage)

Route.patch(
  '/delete-img/:id',
  authentication,
  uploadFile,
  userController.deleteImage
)

Route.patch(
  '/update-profile/:id',
  authentication,
  uploadFile,
  userController.updateData
)

Route.patch(
  '/update-password/:id',
  authentication,
  userController.updatePasswordUser
)

module.exports = Route
