const jwt = require('jsonwebtoken')

async function getAccessToken (payload){
    const token = await jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : '45m'}
    )
    return token
}

async function getRefreshToken (payload){
    const token = await jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : '1d'}
    )
    return token
}

const setJwtCookie = (res, refreshToken) => {
    res.cookie(
        'jwt', 
        refreshToken, 
        {   httpOnly: true, 
            secure:true, 
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000
        }
    )
    return res;
}

module.exports = {getAccessToken, getRefreshToken, setJwtCookie}