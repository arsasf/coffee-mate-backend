const connection = require('../../config/mysql')

module.exports = {
  register: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO user SET ? ', setData, (error, result) => {
        !error
          ? resolve({ id: result.insertId, ...setData })
          : reject(new Error(error))
      })
    })
  },
  getDataCondition: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE ?',
        setData,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getUserDataConditions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE user_id = ?',
        data,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  updateverifiedUser: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET ? WHERE user_id = ?',
        [setData, id],
        (error, result) => {
          console.log(error)
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
  updateUser: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE user SET ? WHERE user_id = ?',
        [setData, id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
