const connection = require('../../config/mysql')

module.exports = {
  createData: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO cart SET ?', setData, (error, result) => {
        // !error ? resolve({id: result.inserId, ...setData}) : reject(new Error(error))
        // console.log(error);
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
  // getDataById: (id) => {
  //   return new Promise((resolve, reject) => {
  //     connection.query(
  //       'SELECT * FROM product WHERE product_id = ?',
  //       id,
  //       (error, result) => {
  //         !error ? resolve(result) : reject(new Error(error))
  //       }
  //     )
  //   })
  // },
  // getDataById: (id) => {
  //   return new Promise((resolve, reject) => {
  //     connection.query(
  //       'SELECT user.user_id,user.user_name, user.user_address,user.user_phone, product.product_name, product.product_image, product.product_size, product.product_base_price, cart.product_qty, cart.product_sub_total FROM user JOIN cart ON user.user_id = cart.user_id  JOIN product ON cart.product_id = product.product_id WHERE cart.cart_id = ?',
  //       id,
  //       (error, result) => {
  //         !error ? resolve(result) : reject(new Error(error))
  //       }
  //     )
  //   })
  // },
  getDataByIdUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT user.user_id,user.user_name, user.user_address,user.user_phone, product.product_name, product.product_image,  product.product_size, product.product_base_price, cart.product_id, cart.product_qty, cart.product_sub_total , cart.product_size FROM user JOIN cart ON user.user_id = cart.user_id  JOIN product ON cart.product_id = product.product_id WHERE cart.user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getCart: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM cart WHERE user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  deleteCart: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM cart WHERE user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
