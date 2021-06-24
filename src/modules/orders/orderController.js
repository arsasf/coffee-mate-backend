const helper = require('../../helpers/wrapper')
const orderModel = require('./orderModel')
const cartModel = require('../cart/cartModel')
const promoModel = require('../promo/promoModel')

module.exports = {
  postOrder: async (req, res) => {
    try {
      console.log(req.decodeToken)
      const id = req.decodeToken.user_id
      const { paymentMethod, promoCode } = req.body
      const invoiceId = Math.floor(1000 + Math.random() * 9000)
      const items = await cartModel.getCart(id)
      if (items.length === 0) {
        return helper.response(
          res,
          404,
          'Please choose product, before checkout !'
        )
      } else {
        let total = 0
        let discount = 0
        console.log(id, paymentMethod, promoCode)
        for (const i of items) {
          total = total + i.product_sub_total
        }

        // *** promo check
        const promo = await promoModel.getPromoByCode(promoCode)
        console.log(promo)
        const today = new Date(Date.now())
        const discAmount = parseInt(promo[0].promo_discount)
        const minPurchase = promo[0].promo_min_price
        const maxDisc = promo[0].promo_max_discount
        const promoStart = promo[0].promo_expire_start
        const promoEnd = promo[0].promo_expire_end

        if (promo.length > 0 && today < promoEnd && today > promoStart) {
          if (total > minPurchase) {
            discount = (total * discAmount) / 100
          }
          if (discount > maxDisc) {
            discount = maxDisc
          }
        }

        console.log(discount)
        console.log(total)
        // *** seed to invoice
        const tax = total * 0.1
        console.log(tax)

        const seedToInvoice = {
          invoice_code: `CM-${invoiceId}`,
          user_id: id,
          promo_code: promoCode,
          invoice_discount: discount,
          invoice_all_product_price: total,
          invoice_tax: tax,
          invoice_sub_total: total + tax - discount
        }
        console.log(seedToInvoice)
        const result = await orderModel.postInvoice(seedToInvoice)
        const invoice = await orderModel.getInvoiceByCode(`CM-${invoiceId}`)

        // *** seed to orders
        for (const i of items) {
          const setData = {
            invoice_id: invoice[0].invoice_id,
            user_id: invoice[0].user_id,
            product_id: i.product_id,
            product_qty: i.product_qty,
            orders_total_price: invoice[0].invoice_sub_total,
            orders_payment_method: paymentMethod,
            orders_status: 'Pending'
          }
          await orderModel.postOrders(setData)
        }

        await cartModel.deleteCart(id)
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
