const helper = require('../../helpers/wrapper')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const promoModel = require('./promoModel')
// const nodemailer = require('nodemailer')
const fs = require('fs')

require('dotenv').config()

module.exports = {
  getDataAll: async (req, res) => {
    try {
      const result = await promoModel.getDataAll()
      if (result.length > 0) {
        // client.set(`getUserid:${id}`, JSON.stringify(result))
        return helper.response(res, 200, 'Success Get Data All', result)
      } else {
        return helper.response(res, 404, 'Failed! No Data')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  postPromo: async (req, res) => {
    try {
      const {
        promoName,
        promoMinPrice,
        promoMaxDiscount,
        promoCode,
        promoDesc,
        promoDiscountpersent,
        promoExpiredStart,
        promoExpiredEnd
      } = req.body
      const setData = {
        promo_name: promoName,
        promo_min_price: parseInt(promoMinPrice),
        promo_max_discount: parseInt(promoMaxDiscount),
        promo_code: promoCode.toUpperCase(),
        promo_desc: promoDesc,
        promo_discount: promoDiscountpersent,
        promo_expire_start: promoExpiredStart,
        promo_expire_end: promoExpiredEnd,
        promo_image: req.file ? req.file.filename : ''
      }
      console.log(setData)
      const result = await promoModel.createData(setData)
      return helper.response(res, 200, 'Succes Create Promo', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
      // console.log(error)
    }
  },
  updateImage: async (req, res) => {
    try {
      const { id } = req.params
      const setData = {
        promo_image: req.file ? req.file.filename : '',
        promo_updated_at: new Date(Date.now())
      }

      const dataToUpdate = await promoModel.getDataById(id)
      if (dataToUpdate.length > 0) {
        if (dataToUpdate.length > 0) {
          const imageToDelete = dataToUpdate[0].promo_image
          const isImageExist = fs.existsSync(`src/uploads/${imageToDelete}`)

          if (isImageExist && imageToDelete) {
            fs.unlink(`src/uploads/${imageToDelete}`, (err) => {
              if (err) throw err
            })
          }
        }
        const result = await promoModel.updateData(setData, id)
        return helper.response(res, 200, 'Success Update Image', result)
      } else {
        return helper.response(res, 404, 'Failed! No Image Is Updated')
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  },
  getDataById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await promoModel.getDataById(id)
      if (result.length > 0) {
        // client.set(`getUserid:${id}`, JSON.stringify(result))
        return helper.response(res, 200, `Success Get Data by id ${id}`, result)
      } else {
        return helper.response(res, 404, `Failed! Data by id ${id} Not Found`)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
      // console.log(error)
    }
  },
  updateData: async (req, res) => {
    try {
      const { id } = req.params
      const getDataId = await promoModel.getDataById(id)
      // console.log(getDataId[0])
      let {
        promoName,
        promoMinPrice,
        promoMaxDiscount,
        promoCode,
        promoDesc,
        promoDiscountpersent,
        promoExpiredStart,
        promoExpiredEnd
      } = req.body
      // let { userName, userPhone, userAddress, userGender, userBirth } = req.body
      console.log(req.body)
      if (promoName === '') {
        promoName = getDataId[0].promo_name
      }
      if (promoMinPrice === '') {
        promoMinPrice = getDataId[0].promo_min_price
      }
      if (promoMaxDiscount === '') {
        promoMaxDiscount = getDataId[0].promo_max_discount
      }
      if (promoCode === '') {
        promoCode = getDataId[0].promo_code
      }
      if (promoDesc === '') {
        promoDesc = getDataId[0].promo_desc
      }
      if (promoDiscountpersent === '') {
        promoDiscountpersent = getDataId[0].promo_discount
      }
      if (promoExpiredStart === '') {
        promoExpiredStart = getDataId[0].promo_expire_start
      }
      if (promoExpiredEnd === '') {
        promoExpiredEnd = getDataId[0].promo_expire_end
      }

      const setData = {
        promo_name: promoName,
        promo_min_price: promoMinPrice,
        promo_max_discount: promoMaxDiscount,
        promo_code: promoCode,
        promo_desc: promoDesc,
        promo_discount: promoDiscountpersent,
        promo_expire_start: promoExpiredStart,
        promo_expire_end: promoExpiredEnd,
        promo_updated_at: new Date(Date.now())
      }
      if (getDataId.length > 0) {
        const result = await promoModel.updateData(setData, id)
        return helper.response(
          res,
          200,
          `Success Update Data by id ${id}`,
          result
        )
      } else {
        return helper.response(res, 404, `Data by id ${id}, not Found`, null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
      // console.log(error)
    }
  },
  deletePromo: async (req, res) => {
    try {
      const { id } = req.params
      const dataToUpdate = await promoModel.getDataById(id)

      if (dataToUpdate.length > 0) {
        if (dataToUpdate[0].promo_image) {
          const imageToDelete = dataToUpdate[0].promo_image
          const isImageExist = fs.existsSync(`src/uploads/${imageToDelete}`)

          if (isImageExist) {
            fs.unlink(`src/uploads/${imageToDelete}`, (err) => {
              if (err) throw err
            })
          }
        }
        const result = await promoModel.deleteData(id)
        return helper.response(res, 200, `Success Delete By Id = ${id}`, result)
      } else {
        return helper.response(res, 404, `Data By id ${id} Not Found !`, null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
