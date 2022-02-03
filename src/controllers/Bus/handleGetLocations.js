const Location = require('../../model/Location')

const handleGetLocations = async (req, res) => {
    let {cityId} = req.query
    if(!cityId) {
        return res.status(400).json({message : "missing required param cityId"})
    }
    cityId = cityId.trim().toLowerCase()
    const result = await Location.find({cityId})
    if(!result) {
        res.status(500).json({message : "given cityId not found"})
    }
    res.json(result.map(x => x.toObject()))
}

module.exports = handleGetLocations