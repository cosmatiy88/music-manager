const express = require('express')
const PORT = process.env.PORT || 5000
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config/db')
const app = express()

//database
mongoose.set('useCreateIndex', true)
mongoose
  .connect(config.database, { useNewUrlParser: true })
  .then(() => {
    console.log('Database is connected')
  })
  .catch((err) => {
    console.log({ database_error: err })
  })
//cors
app.use(cors())
//bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//morgan
app.use(morgan('dev'))
//make uploaded files static
app.use('/uploads', express.static('uploads'))
//music routes
const musicRoutes = require('./api/routes/music')
app.use('/music', musicRoutes)
//testing routes
app.get('/', (req, res) => {
  res.json('Hello MEVN stack developer!')
})
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
