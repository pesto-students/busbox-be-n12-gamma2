const mongoose = require('mongoose')
const dbUtils = require('./dbUtils')
const commonSchema = require('./CommonSchema')

const Schema = mongoose.Schema

const locationSchema = new Schema({
    cityId : dbUtils.reqString,
    locations : [commonSchema.locationSchema]
})

module.exports = mongoose.model('Location', locationSchema)