const express = require('express')
const cors = require('cors')
const app = express()
const corsOptions = require('./configs/corsOptions')
const cookieParser = require('cookie-parser')
const connectDB = require('./configs/dbConn')
const mongoose = require('mongoose')
require('dotenv').config()


connectDB();

app.use(cors(corsOptions));
app.use(express.urlencoded({extended: false}));
app.use(express.json())
//middleware for cookies 
app.use(cookieParser())
 
app.use('/auth', require('./routes/auth'))
app.use('./bookings', require('./routes/bookings'))
app.use('/buses', require('./routes/buses'))

app.get('/', (req, res) => {res.send("server is working fine ..")})


const PORT = process.env.PORT || 3000

mongoose.connection.once('open', () => {
    console.log('Connected To MongoDB');
    app.listen(PORT, () => console.log(`Listening On PORT : ${PORT}`))
})
