const express = require('express')
const Router = express.Router()

const authRoutes = require('../modules/auth/authRoute')
const userRoutes = require('../modules/user/userRoute')
const promoRoutes = require('../modules/promo/promoRoute')
const cartRoutes = require('../modules/cart/cartRoute')
const productRoutes = require('../modules/product/productRoute')
const orderRoutes = require('../modules/orders/orderRoutes')
const invoiceRoutes = require('../modules/invoice/invoiceRoute')

// Router.use('/', (req, res) => {
//   res.send('Hello World')
// })
Router.use('/auth', authRoutes)
Router.use('/user', userRoutes)
Router.use('/promo', promoRoutes)
Router.use('/cart', cartRoutes)
Router.use('/order', orderRoutes)
Router.use('/product', productRoutes)
Router.use('/invoice', invoiceRoutes)

module.exports = Router
