const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbUtils = require('./dbUtils');

const locationSchema = new Schema({
    cityId : dbUtils.reqString,
    locations : [{
        locationName : dbUtils.reqString,
        address : dbUtils.reqString
    }]
})

module.exports = mongoose.model('Location', locationSchema);