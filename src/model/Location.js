const mongoose = require('mongoose');
const dbUtils = require('./dbUtils');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    cityId : dbUtils.reqString,
    locations : [{
        locationName : dbUtils.reqString,
        address : dbUtils.reqString
    }]
})

module.exports = mongoose.model('Location', locationSchema);