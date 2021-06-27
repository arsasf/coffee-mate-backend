const helper = require('../../helpers/wrapper')
const orderModel = require('./orderModel')
const cartModel = require('../cart/cartModel')
// const promoModel = require('../promo/promoModel')

module.exports = {
  postOrder: async (req, res) => {
    try {
      console.log(req.decodeToken)
      const id = req.decodeToken.user_id
      const {
        paymentMethod,
        promoCode,
        discount,
        totalPriceProduct,
        totalOrders,
        tax
      } = req.body
      const invoiceId = Math.floor(1000 + Math.random() * 9000)
      const items = await cartModel.getDataByIdUser(id)
      if (items.length === 0) {
        return helper.response(
          res,
          404,
          'Please choose product, before checkout !'
        )
      } else {
        // *** seed to invoice

        const seedToInvoice = {
          invoice_code: `CM-${invoiceId}`,
          user_id: id,
          promo_code: promoCode,
          invoice_discount: discount,
          invoice_all_product_price: totalPriceProduct,
          invoice_tax: tax,
          invoice_sub_total: totalOrders,
          invoice_status: 'pending'
        }
        console.log(seedToInvoice)
        await orderModel.postInvoice(seedToInvoice)
        const invoice = await orderModel.getInvoiceByCode(`CM-${invoiceId}`)

        // *** seed to orders
        for (const i of items) {
          console.log(i.product_image)
          const setData = {
            invoice_id: invoice[0].invoice_id,
            user_id: invoice[0].user_id,
            product_id: i.product_id,
            product_qty: i.product_qty,
            product_size: i.product_size,
            product_image: i.product_image,
            orders_discount: discount,
            orders_tax: tax,
            orders_all_product_price: totalPriceProduct,
            orders_total_price: invoice[0].invoice_sub_total,
            orders_payment_method: paymentMethod,
            orders_status: 'pending'
          }
          await orderModel.postOrders(setData)
        }

        const result = await cartModel.deleteCart(id)
        return helper.response(res, 200, 'Order placed', result)
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { id } = req.params
      const setData = {
        orders_status: 'DONE',
        orders_updated_at: new Date(Date.now())
      }

      const isExist = await orderModel.getInvoiceById(id)
      if (isExist.length === 0) {
        return helper.response(res, 404, 'Cannot update empty data')
      } else {
        const result = await orderModel.updateOrder(setData, id)

        return helper.response(
          res,
          200,
          'Success marking order as done',
          result
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request')
    }
  },
  getDataByIdUser: async (req, res) => {
    try {
      const { id } = req.params
      const result = await orderModel.getDataByIdUser(id)
      // client.set(`getUserid:${id}`, JSON.stringify(result))
      if (result.length > 0) {
        // client.set(`getUserid:${id}`, JSON.stringify(result))
        return helper.response(res, 200, `Success Get Data by id ${id}`, result)
      } else {
        return helper.response(res, 404, `Failed! Data by id ${id} Not Found`)
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  }
}
