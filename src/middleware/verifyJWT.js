const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"]
    if(!authHeader) return res.status(401).json({message: 'unauthorized'});

    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.status(403).json({message: 'invalid access token'}) // invalid token
            req.user = decoded.email
            next()
        }
    )
}

module.exports = verifyJWT