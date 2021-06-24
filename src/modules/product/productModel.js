const connection = require('../../config/mysql')

module.exports = {
  getDataAll: (limit, offset, keyword, sort, category) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM product WHERE product_name LIKE ? AND product_category LIKE ? ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [keyword, category, limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getDataCount: (keyword, category, sort) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM product WHERE product_name LIKE ? AND product_category LIKE ? ORDER BY ${sort}`,
        [keyword, category],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getDataById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM product WHERE product_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  createData: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO product SET ?',
        setData,
        (error, result) => {
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
        }
      )
    })
  },
  updateData: (setData, id) => {
    // console.log(setData)
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE product SET ? WHERE product_id = ?',
        [setData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  getDataByCategory: (keyword, category, limit, offset, orderBy) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM product WHERE product_name LIKE "%"?"%" AND product_category LIKE "%"?"%" ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
        [keyword, category, limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  countData: (keyword, category) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(*) AS total FROM product WHERE product_name LIKE "%"?"%" AND product_category LIKE "%"?"%"',
        [keyword, category],
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error))
        }
      )
    })
  },
  deleteData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE from product WHERE product_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
