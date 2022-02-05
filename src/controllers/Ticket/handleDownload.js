const fs = require('fs');
const pdf = require('html-pdf')
const template = require('./template')

const handleDownload = (req, res, next) => {
    try {
        const data = req.query;
        console.log(data);
        const details = Object.keys(data).map(key => JSON.parse(data[key]))
        const htmlstr = template(details);
        res.type('html').send(htmlstr);
    } catch (err) {
        console.error(err, {...err});
        res.sendStatus(500);
    }
}

module.exports = handleDownload;