const express = require('express')
const Route = express.Router()
const authMiddleware = require('../../middlewares/auth')
const orderController = require('./orderController')

Route.get('/', authMiddleware.authentication, orderController.getDataAllOrders)

Route.post(
  '/',
  authMiddleware.authentication,
  // authMiddleware.isAdmin,
  orderController.postOrder
)
Route.post(
  '/midtrans-notification',
  authMiddleware.authentication,
  orderController.postOrderNotifiation
)

Route.patch(
  '/update/:id',
  authMiddleware.authentication,
  orderController.updateOrder
)
Route.get(
  '/by-id-user/:id',
  authMiddleware.authentication,
  orderController.getDataByIdUser
)

Route.patch(
  '/update-coupon/:id',
  authMiddleware.authentication,
  orderController.updateUserCoupon
)
module.exports = Route
