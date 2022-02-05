const whiteList = ['http://localhost:1234', 'http://patilgajanan.com']
const corsOptions = {
    origin : (origin, callback) => {
        if(whiteList.includes(origin) || !origin){
            callback(null, true)
        } else {
            callback(new Error("CORS ERROR"))
        }
    },
    optionsSuccessStatus : 200 ,
    credentials:true
}

module.exports = corsOptions