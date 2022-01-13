const User = require('../../model/User')
const bcrypt = require('bcrypt')

const handleSignUp = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) return res.status(400).json({message : "email & password and required fields."})
    const duplicate = await User.findOne({email}).exec()
    if(duplicate) return res.sendStatus(409) // Conflict

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await User.create({ email, password:hashedPassword })
        console.log(result)
        res.status(201).json({'success' : `new user with email:${email} created successfully`})
    } catch (err) {
        res.status(500).json({message : err.message})
    }
}

module.exports = handleSignUp