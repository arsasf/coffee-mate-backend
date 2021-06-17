require('dotenv').config()
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const port = process.env.port
const routerNavigation = require('./routes')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())
app.use(cors())
app.options('*', cors()) // all access cors.
app.use(helmet())
app.use(morgan('dev'))
app.use('/backend5/api/v1', routerNavigation)
app.use('/backend5/api', express.static(path.join(__dirname, 'uploads')))

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
