const bcrypt = require('bcrypt')
const jwtUtils = require('../../utils/jwtUtils')
const User = require('../../model/User')

const handleLogin = async (req, res) => {
    const {email , password} = req.body;
    if( !email || !password) return res.status(400).json({message : "email and password are required"})
    const foundUser = await User.findOne({email}).exec();
    if(!foundUser) return res.sendStatus(401); // UnAuthorized

    const match = await bcrypt.compare(password, foundUser.password)
    if(!match) return res.sendStatus(401);

    const user = {email, password};
    const refreshToken = await jwtUtils.getRefreshToken(user);
    const accessToken = await jwtUtils.getAccessToken(user);

    //save refreshToken with current user in database
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
    res.json({accessToken});
}

module.exports = handleLogin;