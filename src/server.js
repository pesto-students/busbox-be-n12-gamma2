global.TextEncoder = require("util").TextEncoder; 
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./configs/corsOptions')
const connectDB = require('./configs/dbConn')
const mongoose = require('mongoose')
const path = require('path')
mongoose.plugin((schema) => {
    if (!schema.options.toObject) schema.options.toObject = {};
    schema.options.toObject.transform = (doc, ret, options) => {
        delete ret['_id'];
        delete ret['__v'];
        return ret;
    }
});

connectDB()

const app = express()

// middlewares
app.use(cors(corsOptions))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
// routes
app.use('/auth', require('./routes/auth'))
app.use('/bookings', require('./routes/bookings'))
app.use('/buses', require('./routes/buses'))

const PORT = process.env.PORT || 3000
mongoose.connection.once('open', () => {
    console.log('Connected To MongoDB')
    app.listen(PORT, () => console.log(`Listening On PORT : ${PORT}`))
})