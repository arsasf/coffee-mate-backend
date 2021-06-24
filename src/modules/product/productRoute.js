const express = require('express')
const Route = express.Router()
const uploadFile = require('../../middlewares/uploads')
const productController = require('./productController')
const { authentication, isAdmin } = require('../../middlewares/auth')
// const redisMiddleware = require('../../middlewares/redis')

Route.get('/', authentication, productController.getAllProduct)
Route.get('/by-id/:id', authentication, productController.getDataById)
Route.patch(
  '/img/:id',
  authentication,
  isAdmin,
  uploadFile,
  productController.updateImage
)
Route.post(
  '/',
  authentication,
  isAdmin,
  uploadFile,
  productController.postProduct
)
Route.patch(
  '/:id',
  authentication,
  isAdmin,
  uploadFile,
  productController.updateProduct
)

Route.get('/category/', authentication, productController.getCategory)

Route.delete('/:id', authentication, isAdmin, productController.deleteProduct)

module.exports = Route
