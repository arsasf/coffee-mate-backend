const helper = require('../../helpers/wrapper')
const invoiceModel = require('./invoiceModel')

module.exports = {

  getInvoice: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      const invoice = await invoiceModel.getInvoice(id)

      if (invoice.length === 0) {
        return helper.response(res, 404, 'No invoice for this account')
      } else {
        return helper.response(res, 200, 'Success getting invoices', invoice)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  getHistory: async (req, res) => {
    try {
      const { id } = req.params
      const invoice = await invoiceModel.getHistoryId(id)

      if (invoice.length === 0) {
        return helper.response(res, 404, 'No invoice for this account')
      } else {
        return helper.response(res, 200, 'Success getting invoices', invoice)
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad request', error)
      console.log(error)
    }
  },

  deleteInvoice: async (req, res) => {
    try {
      const { id } = req.params

      const result = await invoiceModel.deleteInvoice(id)
      return helper.response(res, 200, 'Success deleting invoice', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad request', error)
    }
  }

}
