const helper = require('../../helpers/wrapper')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const userModel = require('./userModel')
// const nodemailer = require('nodemailer')
const fs = require('fs')

require('dotenv').config()

module.exports = {
  getDataAll: async (req, res) => {
    try {
      const result = await userModel.getDataAll()
      return helper.response(res, 200, 'Succes Get All Data Product', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateImage: async (req, res) => {
    try {
      const { id } = req.params
      const setData = {
        user_image: req.file ? req.file.filename : '',
        user_updated_at: new Date(Date.now())
      }

      const dataToUpdate = await userModel.getDataById(id)
      if (dataToUpdate.length > 0) {
        if (dataToUpdate.length > 0) {
          const imageToDelete = dataToUpdate[0].user_image
          const isImageExist = fs.existsSync(`src/uploads/${imageToDelete}`)

          if (isImageExist && imageToDelete) {
            fs.unlink(`src/uploads/${imageToDelete}`, (err) => {
              if (err) throw err
            })
          }
        }
        const result = await userModel.updateData(setData, id)
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
      const result = await userModel.getDataById(id)
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
  },
  updateData: async (req, res) => {
    try {
      const { id } = req.params
      const getDataId = await userModel.getDataById(id)
      // console.log(getDataId[0])
      let { userDisplay, userEmail, userName, userPhone, userAddress, userGender, userBirth } = req.body
      console.log(req.body)
      if (userEmail === '') {
        userEmail = getDataId[0].user_email
      }
      if (userName === '') {
        userName = getDataId[0].user_name
      }
      if (userPhone === '') {
        userPhone = getDataId[0].user_phone
      }
      if (userDisplay === '') {
        userDisplay = getDataId[0].user_display_name
      }
      if (userAddress === '') {
        userAddress = getDataId[0].user_address
      }
      if (userGender === 'Male') {
        userGender = 'Male'
      }
      if (userGender === 'Female') {
        userGender = 'Female'
      }
      if (userBirth === '') {
        userBirth = getDataId[0].user_birth
      }

      const setData = {
        user_email: userEmail,
        user_display_name: userDisplay,
        user_name: userName,
        user_phone: userPhone,
        user_address: userAddress,
        user_gender: userGender,
        user_birth: userBirth,
        user_updated_at: new Date(Date.now())
      }
      if (getDataId.length > 0) {
        const result = await userModel.updateData(setData, id)
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
  }
}
