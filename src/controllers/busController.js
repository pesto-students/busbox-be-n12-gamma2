const moment = require('moment')
const Bus = require('../model/Bus')
const Location = require('../model/Location')

function isMissingFields(req){
    const {sourceCity, destinationCity, date} = req.body
    return (!sourceCity || !destinationCity || !date); 
}

function getBusesAvailableOnDay(buses, date){
    const dayOfWeek = moment.weekdays()[date.weekday()];
    const runningBuses = buses.filter(bus => {
        return bus.runningDays.map(day => day.toLowerCase().trim()).includes(dayOfWeek.toLowerCase().trim())
    })
    return runningBuses;
}

function getBusesOnRoute(buses, source, destination){

    const busesOnRoute = buses.filter( bus => {
        const sourceStopNumber = bus.busRoute.filter(route => route.cityName === source)[0]?.stopNumber;
        const destinationStopNumber = bus.busRoute.filter(route => route.cityName === destination)[0]?.stopNumber;
        return sourceStopNumber < destinationStopNumber;
    })
    return busesOnRoute;
}

const getBuses = async (req, res) => {
    let {sourceCity, destinationCity, date} = req.body;
    if(isMissingFields(req)) { 
        return res.status(400).json({message : "missing required fields"});
    }
    sourceCity = sourceCity.toLowerCase().trim()
    destinationCity = destinationCity.toLowerCase().trim()
    
    const dateObj = moment(date, "DD/MM/YYYY", true);
    if(!dateObj.isValid()) { 
        return res.status(400).json({message : "Date must be in DD/MM/YYYY format"});
    }

    const busesConnectingCities = await Bus.find({'busRoute.cityName' : {$all : [sourceCity, destinationCity]}});
    
    const busesOnRoute = getBusesOnRoute(busesConnectingCities, sourceCity, destinationCity);

    if(!busesOnRoute?.length >0) { 
        return res.status(404).json({message : "No Routes Availalbe"})
    }
    const busesAvailableOnDay = getBusesAvailableOnDay(busesOnRoute, dateObj)

    if(!busesAvailableOnDay?.length >0) {
        return res.status(404).json({message : "No Routes Availalbe on selected day"})
    }
    res.json(busesAvailableOnDay);
}

const getLocations = async (req, res) => {
    let {cityId} = req.body;
    if(!cityId) {
        res.status(400).json({message : "missing required param cityId"});
    }

    cityId = cityId.trim().toLowerCase();
    const result = await Location.find({cityId});
    if(!result) res.sendStatus(500);
    res.json(result);
}
module.exports = {getBuses, getLocations}



