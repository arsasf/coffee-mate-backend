const helper = require('../../helpers/wrapper')
const cartModel = require('./cartModel')

require('dotenv').config()

module.exports = {
  postCart: async (req, res) => {
    try {
      const { userId, productId, productPrice, productQty, productSize } =
        req.body
      const setData = {
        user_id: userId,
        product_id: productId,
        product_qty: parseInt(productQty),
        product_sub_total: parseInt(productPrice),
        product_size: productSize
      }
      console.log(setData)
      const result = await cartModel.createData(setData)
      return helper.response(res, 200, 'Succes Create Cart', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
      // console.log(error)
    }
  },
  getDataByIdUser: async (req, res) => {
    try {
      const { id } = req.params
      const result = await cartModel.getDataByIdUser(id)
      console.log(result)
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
  // getDataById: async (req, res) => {
  //   try {
  //     const { id } = req.params
  //     const result = await cartModel.getDataById(id)
  //     // client.set(`getUserid:${id}`, JSON.stringify(result))
  //     if (result.length > 0) {
  //       // client.set(`getUserid:${id}`, JSON.stringify(result))
  //       return helper.response(res, 200, `Success Get Data by id ${id}`, result)
  //     } else {
  //       return helper.response(res, 404, `Failed! Data by id ${id} Not Found`)
  //     }
  //   } catch (error) {
  //     // return helper.response(res, 400, 'Bad Request', error)
  //     console.log(error)
  //   }
  // }
}
