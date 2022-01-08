const express = require('express')
const cors = require('cors')
const app = express()
const corsOptions = require('./Configs/corsOptions')
 
app.use(cors(corsOptions));


app.use('/auth', require('./routes/auth'))
// app.use('/bookings', require('./routes/bookings'))
app.use('./bookings', require('./routes/bookings'))
app.use('/buses', require('./routes/buses'))

app.get('/', (req, res) => {res.send("server is working fine ..")})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening On PORT : ${PORT}`);
});