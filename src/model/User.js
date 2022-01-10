const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbUtils = require('./dbUtils')

const userSchema = new Schema({
    email : dbUtils.reqString, 
    password : dbUtils.reqString, 
    refreshToken : String
})

module.exports = mongoose.model('User', userSchema);