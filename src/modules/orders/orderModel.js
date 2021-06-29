const connection = require('../../config/mysql')
const midtransClient = require('midtrans-client')

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
  updateInvoice: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE invoice SET ? WHERE invoice_id = ?',
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
  updateUserCoupon: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET ? WHERE user_id = ?',
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
  },
  getDataAllOrders: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM orders JOIN user ON user.user_id = orders.user_id WHERE orders.orders_status = "pending" ORDER BY orders.invoice_id',
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  postOrderMidtrans: ({ orderId, orderAmount }) => {
    return new Promise((resolve, reject) => {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-cQ2SdW4dl4T4ETGWBbXzM6BS',
        clientKey: 'SB-Mid-client-Br8qu0hv-PGs4oyU'
      })
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: orderAmount
        },
        credit_card: {
          secure: true
        }
      }
      snap
        .createTransaction(parameter)
        .then((transaction) => {
          // transaction token
          const transactionToken = transaction.token
          console.log('transaction:', transaction)
          console.log('transactionToken:', transactionToken)
          resolve(transaction.redirect_url)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
}
