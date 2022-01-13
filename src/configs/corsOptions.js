const whiteList = []
const corsOptions = {
    origin : (origin, callback) => {
        if(whiteList.includes(origin) || !origin){
            callback(null, true)
        } else {
            callback(new Error("CORS ERROR"))
        }
    },
    optionsSuccessStatus : 200 
}

module.exports = corsOptions