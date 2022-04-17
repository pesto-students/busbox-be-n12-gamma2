const User = require('../../model/User')
const bcrypt = require('bcrypt')
const redis = require('../../configs/redis')

const handleSignUp = async (req, res) => {
    const {email, password, name, otp} = req.body
    if (!email || !password || !name || !otp) return res.status(400).json({message : "name, email & password and required fields."})
    const duplicate = await User.findOne({email}).exec()
    if(duplicate) return res.sendStatus(409) // Conflict
    
    redis.getClient()
    .then(client => client.get(email))
    .then(validOtp => new Promise((resolve, reject) => {
            if (otp === validOtp) resolve(otp)
            else reject("Invalid Otp")
    })).then(otp => bcrypt.hash(password, 10)).then(hashedPassword => {
        return User.create({ name, email, password:hashedPassword })
    }).then(user => res.status(201).json({'success' : `new user with email:${email} created successfully`}))
    .catch(err => {
        console.log("Error ", err, {...err});
        res.status(500).json({message : err.message})
    })
}

module.exports = handleSignUp