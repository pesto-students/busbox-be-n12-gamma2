const {OAuth2Client} = require('google-auth-library');
const User = require('../../model/User');
const jwtUtils = require('./jwtUtils')
const uuid = require('uuid').v4();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const handleGoogleLogin = async (req, res) => {
    const {idToken} = req.body;
    client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID}).then(async response => {
        const {email_verified, name, email} = response.payload;
        console.log(response.payload);
        if(!email_verified){
            return res.sendStatus(401);
        }

        const user = {email}
        const refreshToken = await jwtUtils.getRefreshToken(user)
        const accessToken = await jwtUtils.getAccessToken(user)
    
        const successResponse = () => {
            jwtUtils.setJwtCookie(res, refreshToken)
            res.json({accessToken})    
        }

        // if user with email already exists -> update refresh token 
        // else create user and set refresh token

        const foundUser = await User.findOne({email}).exec();

        if(!foundUser){
            return User.create([{
                name,
                email, 
                password : uuid(),
                refreshToken
            }]).then((data => {
                successResponse()
            })).catch((err) => {
                console.error(err, {...err})
                res.sendStatus(500)
            })
        }

        foundUser.refreshToken = refreshToken
        foundUser.name = name;
        const result = await foundUser.save()
        successResponse();
    }).catch((err)=>{
        console.error(err, {...err})
        res.sendStatus(500)
    })
}

module.exports = handleGoogleLogin;