require('dotenv').config()
const authModel = require('./authModel')
const bcrypt = require('bcrypt')
const helper = require('../../helpers/wrapper')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
// const fs = require('fs')

module.exports = {
  register: async (req, res) => {
    try {
      const { userPhone, userEmail, userPassword } = req.body

      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(userPassword, salt)

      const checkEmail = await authModel.getDataCondition({
        user_email: userEmail
      })

      if (checkEmail.length > 0) {
        return helper.response(
          res,
          401,
          'Email is Registered',
          checkEmail[0].user_email
        )
      } else {
        const setData = {
          user_display_name: 'user',
          user_phone: userPhone,
          user_email: userEmail,
          user_name: 'Set your name',
          user_password: encryptPassword,
          user_role: 'user'
        }
        // console.log(setData)
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
          }
        })

        const result = await authModel.register(setData)
        delete result.user_password

        const mailOption = {
          from: '"Coffe Matte" <putericky@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: 'Coffe Matte - Activation Email', // Subject line
          html: `<b>Click Here to activate your account</b><form action='http://localhost:3005/backend5/api/v1/auth/account/verify/${result.id}' method="post">
          <button type="submit" name="your_name" value="your_value">Go</button>
      </form>` // html body
        }

        await transporter.sendMail(mailOption, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log(`Email Sent ${result.id}: ` + info.response)
          }
        })
        return helper.response(
          res,
          200,
          `Success Register ${result.id}`,
          result
        )
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  },
  verificationUser: async (req, res) => {
    try {
      const { id } = req.params
      const setData = {
        user_verified: '1'
      }
      const getUserId = await authModel.getUserDataConditions(id)
      const result = await authModel.updateverifiedUser(setData, id)
      if (getUserId.length > 0) {
        // return helper.response(
        //   res,
        //   200,
        //   'Success! Your Account Has Been Verified.'
        // )
        return res.render('index.ejs', {
          data: result,
          user: getUserId[0]
        })
      } else {
        return helper.response(res, 404, `Data By Id ${id} Not Found`, null)
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  },

  login: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body
      const isExist = await authModel.getDataCondition({
        user_email: userEmail
      })

      if (isExist.length > 0) {
        const isMatch = bcrypt.compareSync(
          userPassword,
          isExist[0].user_password
        )

        if (isMatch) {
          const payLoad = isExist[0]
          delete payLoad.user_password
          const token = jwt.sign({ ...payLoad }, 'SECRET', { expiresIn: '24h' })
          const result = { ...payLoad, token }

          return helper.response(res, 200, 'Login succeed', result)
        } else {
          return helper.response(res, 401, 'Password mismatch')
        }
      } else {
        return helper.response(res, 404, 'Email not registered')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad request.', error)
    }
  },

  reqOtp: async (req, res) => {
    console.log(req.body)
    try {
      const { email } = req.body
      const otp = Math.floor(1000 + Math.random() * 9000)
      const isExist = await authModel.getDataCondition({ user_email: email })

      if (isExist.length > 0) {
        const id = isExist[0].user_id
        const setData = {
          user_otp: otp,
          user_updated_at: new Date(Date.now())
        }

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
          }
        })

        const mailOptions = {
          from: 'Coffee Mate Team',
          to: isExist[0].user_email,
          subject: 'OTP to change your password',
          html: `
          <h1>Hello</h1>
          <p>We noticed that you are requesting to change your password.</p>
          <p>Please use ${otp} to change your password and let no one know about it.</p>`
        }

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) throw err
          console.log('Email sent' + info.response)
        })

        const result = await authModel.updateUser(setData, id)
        return helper.response(res, 200, 'OTP Sent', result)
      } else {
        return helper.response(res, 404, 'Email not registered')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad request', error)
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, newPassword, otp } = req.body
      const user = await authModel.getDataCondition({ user_email: email })
      const timeSpan = Math.ceil((new Date(Date.now()) - user[0].user_updated_at) / 60000)

      if (+otp === +user[0].user_otp && timeSpan <= 10) {
        const salt = bcrypt.genSaltSync(10)
        const encryptPassword = bcrypt.hashSync(newPassword, salt)
        const setData = {
          user_password: encryptPassword,
          user_updated_at: new Date(Date.now())
        }
        const result = await authModel.updateUser(setData, user[0].user_id)

        return helper.response(res, 200, 'Success change password', result)
      } else {
        return helper.response(res, 300, 'Otp expired or mismatch')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad request', error)
    }
  }
}
