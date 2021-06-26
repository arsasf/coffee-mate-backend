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
  getTotalPerDayByWeek: async (req, res) => {
    try {
      const { time } = req.query
      const totalPerDay = []
      const days = [0, 1, 2, 3, 4, 5, 6]

      for (const day of days) {
        const result = await invoiceModel.getTotalPerDayByWeek(time, day)
        totalPerDay.push(result)
      }
      return helper.response(
        res,
        200,
        'Success get total per day by selected week',
        totalPerDay
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad request', error)
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
