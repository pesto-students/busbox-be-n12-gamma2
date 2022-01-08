const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const jwtUtils = require('../utils/jwtUtils')
const User = require('../model/User')

const handleSignUp = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({message : "email & password and required fields."})
    const duplicate = await User.findOne({email}).exec();
    if(duplicate) return res.sendStatus(409); // Conflict

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ email, password:hashedPassword })
        console.log(result);
        res.status(201).json({'success' : `new user with email:${email} created successfully`})
    } catch (err) {
        res.status(500).json({message : err.message});
    }
}


const handleLogIn = async (req, res) => {
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

const handleLogOut = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); // No content;
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: "None", secure: true})
        return res.sendStatus(204); // No content;
    }
    
    // delete refreshToken in db
    foundUser.refreshToken = '';
    foundUser.save();
    res.clearCookie('jwt', {httpOnly: true, sameSite: "None", secure: true});
    res.sendStatus(204);
}


const handleRefresh = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    var foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser) return res.sendStatus(403); // Forbidden

    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);   
            const user = {
                email:decoded.email, 
                password:decoded.password
            }
            const accessToken = await jwtUtils.getAccessToken(user)
            res.json({accessToken})
        }
    )
}

module.exports = {
    handleLogIn, 
    handleLogOut, 
    handleSignUp, 
    handleRefresh
}