const mongoose = require('mongoose');
const dbUtils = require('./dbUtils')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : dbUtils.reqString, 
    password : dbUtils.reqString, 
    refreshToken : String
})

module.exports = mongoose.model('User', userSchema);