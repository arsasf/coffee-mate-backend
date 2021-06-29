const helper = require('../../helpers/wrapper')
const invoiceModel = require('./invoiceModel')
const ejs = require('ejs')
const pdf = require('html-pdf')
const path = require('path')

module.exports = {
  getInvoice: async (req, res) => {
    try {
      const id = req.decodeToken.user_id
      const invoice = await invoiceModel.getInvoice(id)
      console.log(invoice)
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
  },
  getTotalPerDayByWeek: async (req, res) => {
    try {
      const { time } = req.query
      const days = [0, 1, 2, 3, 4, 5, 6]

      const totalPerDay = []
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
  exportEarningsData: async (req, res) => {
    try {
      const { time } = req.query
      const days = [0, 1, 2, 3, 4, 5, 6]

      const totalPerDay = []
      for (const day of days) {
        const result = await invoiceModel.getTotalPerDayByWeek(time, day)
        totalPerDay.push(result)
      }

      ejs.renderFile(
        path.join(__dirname, '../../templates', 'report-earnings-template.ejs'),
        { earnings: totalPerDay },
        (err, data) => {
          if (err) {
            return helper.response(res, 400, 'Export failed', err)
          } else {
            const options = {
              height: '11.25in',
              width: '8.5in',
              header: {
                height: '20mm'
              },
              footer: {
                height: '20mm'
              }
            }
            pdf
              .create(data, options)
              .toFile(
                path.join(__dirname, '../../../public', 'report-earnings.pdf'),
                function (err, data) {
                  if (err) {
                    return helper.response(res, 400, 'Export failed', err)
                  } else {
                    return helper.response(res, 200, 'Export PDF success', {
                      url: 'http://localhost:3005/backend5/api/report-earnings.pdf'
                    })
                  }
                }
              )
          }
        }
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad request', error)
    }
  }
}
