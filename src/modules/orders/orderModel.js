const connection = require('../../config/mysql')

module.exports = {
  postOrders: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO orders SET ?', setData, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...setData
          }
          resolve(newResult)
        } else {
          // console.log(error)
          reject(new Error(error))
        }
      })
    })
  },

  postInvoice: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO invoice SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            // console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  },

  getInvoiceByCode: (code) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM invoice WHERE invoice_code = ?',
        code,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  getInvoiceById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM invoice WHERE invoice_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  updateOrder: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE orders SET ? WHERE invoice_id = ?',
        [setData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...setData
            }
            resolve(newResult)
          } else {
            // console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  },
  getDataByIdUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT orders.orders_id,invoice.invoice_code, orders.user_id, invoice.invoice_sub_total, orders.orders_status, product.product_image FROM orders JOIN product ON orders.product_id = product.product_id JOIN invoice ON orders.invoice_id = invoice.invoice_id WHERE invoice.user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
