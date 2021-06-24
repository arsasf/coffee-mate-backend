const express = require('express')
const Route = express.Router()
const { authentication } = require('../../middlewares/auth')
const invoiceController = require('./invoiceController')

Route.get(
  '/',
  authentication,
  invoiceController.getInvoice
)
Route.get(
  '/history/:id',
  // authentication,
  invoiceController.getHistory
)

Route.delete(
  '/:id',
  authentication,
  invoiceController.deleteInvoice
)

module.exports = Route
