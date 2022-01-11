const User = require('../../model/User')

const clearCookieAndSendResponse = (res) => {
    res.clearCookie('jwt', {httpOnly: true, sameSite: "None", secure: true})
    return res.sendStatus(204); // No content;
}

const handleLogOut = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); // No content;
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser){
        return clearCookieAndSendResponse(res);
    }
    
    // delete refreshToken in db
    foundUser.refreshToken = '';
    foundUser.save();
    
    clearCookieAndSendResponse();
}

module.exports = handleLogOut;