const connection = require('../../config/mysql')

module.exports = {
  getInvoice: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM invoice WHERE user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getHistoryId: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT orders.orders_id,invoice.invoice_id,invoice.invoice_code, orders.user_id, invoice.invoice_sub_total, orders.orders_status, product.product_image FROM orders JOIN product ON orders.product_id = product.product_id JOIN invoice ON orders.invoice_id = invoice.invoice_id WHERE invoice.user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getTotalPerDayByWeek: (time, day) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT SUM(invoice_sub_total) AS total, WEEKDAY(invoice_created_at) AS day FROM invoice WHERE WEEK(invoice_created_at) = WEEK('${time}') AND WEEKDAY(invoice_created_at) = ${day}`,
        (error, result) => {
          if (!error) {
            const { day, total } = result[0]
            const newResult = {
              day: !day ? null : day,
              total: !total ? 0 : total
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  deleteInvoice: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM invoice WHERE invoice_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
