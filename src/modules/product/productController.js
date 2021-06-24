const helper = require('../../helpers/wrapper')
const productModel = require('./productModel')
// const redis = require('redis')
// const client = redis.createClient()
const fs = require('fs')

require('dotenv').config()

module.exports = {
  getAllProduct: async (req, res) => {
    try {
      let { page, lim, sort, keyword, category } = req.query
      lim = lim ? +lim : 3
      page = page ? +page : 1
      keyword = `%${keyword}%` || '%'
      sort = sort || 'product_name ASC'
      category = `%${category}%` || '%'
      const offset = page * lim - lim
      const dataCount = await productModel.getDataCount(keyword, category, sort)
      const totalData = dataCount[0].total
      const totalPage = Math.ceil(totalData / lim)
      const pageInfo = {
        page,
        totalPage,
        lim,
        totalData
      }
      const result = await productModel.getDataAll(lim, offset, keyword, sort)
      // client.setex(
      //   `getproduct:${JSON.stringify(req.query)}`,
      //   3600,
      //   JSON.stringify({ result, pageInfo })
      // )

      return helper.response(res, 200, 'Success get data', result, pageInfo)
    } catch (error) {
      return helper.response(res, 400, 'Bad request')
    }
  },
  getDataById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await productModel.getDataById(id)
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
  },
  postProduct: async (req, res) => {
    try {
      const {
        productName,
        productPrice,
        productCategory,
        productDesc,
        productSize
      } = req.body
      const setData = {
        product_name: productName,
        product_base_price: parseInt(productPrice),
        product_category: productCategory,
        product_desc: productDesc,
        product_size: productSize,
        product_image: req.file ? req.file.filename : ''
      }
      console.log(setData)
      const result = await productModel.createData(setData)
      // console.log(result)
      return helper.response(res, 200, 'Succes Create Product', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params
      const {
        productName,
        productPrice,
        productCategory,
        productDesc,
        productSize
      } = req.body
      const setData = {
        product_name: productName,
        product_base_price: parseInt(productPrice),
        product_category: productCategory,
        product_desc: productDesc,
        product_size: productSize,
        product_updated_at: new Date(Date.now())
      }
      const dataToUpdate = await productModel.getDataById(id)
      if (dataToUpdate.length > 0) {
        // console.log(setData)
        const result = await productModel.updateData(setData, id)

        // console.log(result)
        return helper.response(res, 200, 'Succes Create Product', result)
      } else {
        return helper.response(res, 404, 'Failed! Data not Found')
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateImage: async (req, res) => {
    try {
      const { id } = req.params
      const setData = {
        product_image: req.file ? req.file.filename : '',
        product_updated_at: new Date(Date.now())
      }

      const dataToUpdate = await productModel.getDataById(id)
      if (dataToUpdate.length > 0) {
        if (dataToUpdate.length > 0) {
          const imageToDelete = dataToUpdate[0].product_image
          const isImageExist = fs.existsSync(`src/uploads/${imageToDelete}`)

          if (isImageExist && imageToDelete) {
            fs.unlink(`src/uploads/${imageToDelete}`, (err) => {
              if (err) throw err
            })
          }
        }
        const result = await productModel.updateData(setData, id)
        return helper.response(res, 200, 'Success Update Image', result)
      } else {
        return helper.response(res, 404, 'Failed! No Image Is Updated')
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  },

  getCategory: async (req, res) => {
    // get data by category with pagination - all data stored in query
    try {
      let { page, limit, category, orderBy, keyword } = req.query

      // keyword = keyword ? +keyword : ''
      page = page ? +page : (page = 1)
      limit = limit ? +limit : (limit = 5)
      // if (!page) {
      //   page = 1
      // }
      // if (!limit) {
      //   limit = 20
      // }
      if (!category) {
        category = ''
      }
      if (!orderBy) {
        orderBy = 'product_id ASC'
      }
      if (!keyword) {
        keyword = ''
      }
      const totalData = await productModel.countData(keyword, category)
      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }
      const result = await productModel.getDataByCategory(
        keyword,
        category,
        limit,
        offset,
        orderBy
      )

      if (result.length === 0) {
        return helper.response(res, 404, `No data found for ${category}`)
      } else {
        return helper.response(
          res,
          200,
          'Success get data by category',
          result,
          pageInfo
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params
      const isExist = await productModel.getDataById(id)
      if (isExist.length === 0) {
        return helper.response(res, 404, 'Cannot delete empty data')
      } else {
        if (isExist.length > 0) {
          const imageToDelete = isExist[0].product_image
          const isImageExist = fs.existsSync(`src/uploads/${imageToDelete}`)

          if (isImageExist && imageToDelete) {
            fs.unlink(`src/uploads/${imageToDelete}`, (err) => {
              if (err) throw err
            })
          }
        }
        const result = await productModel.deleteData(id)

        return helper.response(
          res,
          200,
          `Success delete product id ${id}`,
          result
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  }
}
