const express = require('express')
const Route = express.Router()
const uploadFile = require('../../middlewares/uploads')
const authMiddleware = require('../../middlewares/auth')

const promoController = require('./promoController')

Route.get('/', authMiddleware.authentication, promoController.getDataAll)
Route.get(
  '/by-id/:id',
  // authMiddleware.authentication,
  promoController.getDataById
)
Route.patch(
  '/img/:id',
  authMiddleware.authentication,
  uploadFile,
  promoController.updateImage
)
Route.patch(
  '/update-promo/:id',
  authMiddleware.authentication,
  uploadFile,
  // redisMiddleware.clearDataUserId,
  promoController.updateData
)
Route.post(
  '/',
  authMiddleware.authentication,
  uploadFile,
  promoController.postPromo
)
Route.delete(
  '/:id',
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  // redisMiddleware.clearDataMovieRedis,
  promoController.deletePromo
)

module.exports = Route
