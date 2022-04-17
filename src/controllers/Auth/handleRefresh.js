const jwtUtils = require('./jwtUtils')
const User = require('../../model/User')
const jwt = require('jsonwebtoken')

const handleRefresh = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    var foundUser = await User.findOne({refreshToken}).exec()
    if(!foundUser) return res.sendStatus(403) // Forbidden

    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403)   
            const user = {
                email:decoded.email, 
                password:decoded.password
            }
            const accessToken = await jwtUtils.getAccessToken(user)
            res.json({accessToken})
        }
    )
}

module.exports = handleRefresh