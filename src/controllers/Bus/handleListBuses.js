const moment = require('moment')
const Bus = require('../../model/Bus')
const BusStatus = require('../../model/BusStatus');

function handleMissingFields(req, res){
    const {sourceCity, destinationCity, date} = req.query
    if(!sourceCity) {
        res.status(400).json({message : "missing required field 'sourceCity' : 'String' "})
        return false;
    } else if(!destinationCity) {
        res.status(400).json({message : "missing required field 'destinationCity' : 'String' "})
        return false;
    } else if(!date) {
        res.status(400).json({message : "missing required field 'date' : 'String(DD/MM/YYYY)' "})
        return false;
    }
    return true;
}

function getBusesAvailableOnDay(buses, date){
    const dayOfWeek = moment.weekdays()[date.weekday()]
    const runningBuses = buses.filter(bus => {
        const lowercaseRunningDays = bus.runningDays.map(day => day.toLowerCase().trim())
        const lowercaseDayOfWeek = dayOfWeek.toLowerCase().trim() 
        return lowercaseRunningDays.includes(lowercaseDayOfWeek)
    })
    return runningBuses
}

const getStopNumber = (bus, cityName) => {
    const stopNumber = bus.busRoute.filter(route => 
        route.cityName === cityName)[0]?.stopNumber
    return stopNumber;
}

function getBusesOnRoute(buses, sourceCity, destinationCity){
    const busesOnRoute = buses.filter( bus => {
        const sourceStopNumber = getStopNumber(bus, sourceCity)
        const destinationStopNumber = getStopNumber(bus, destinationCity)
        return sourceStopNumber < destinationStopNumber
    })
    return busesOnRoute
}

function filterOutFullBuses(buses, date){
    return buses.filter(async bus => {
        const busId = bus.busId;
        const busStatus = await BusStatus.findOne({busId, date})
        if(!busStatus) return true;
        if(busStatus?.bookedSeats?.length < bus.numberOfSeats) return true;
        return false;
    })
}

function addPricePerSeat(sourceCity, destinationCity) {
    return function (busDocument) {
        const bus = busDocument.toObject()
        console.log(bus);
        const sourceStopNumber = getStopNumber(bus, sourceCity)
        const destinationStopNumber = getStopNumber(bus, destinationCity)
        const numberOfStops = (destinationStopNumber - sourceStopNumber)
        const pricePerStop = (bus.priceFromOriginToEnd / bus.busRoute.length) 
        const pricePerSeat = pricePerStop * numberOfStops; 
        return { ...bus, pricePerSeat }
    }
}

const handleListBuses = async (req, res) => {
    let {sourceCity, destinationCity, date} = req.query
    if(!handleMissingFields(req, res)) return;

    sourceCity = sourceCity.toLowerCase().trim()
    destinationCity = destinationCity.toLowerCase().trim()
    
    const dateObj = moment(date, "DD/MM/YYYY", true)
    if(!dateObj.isValid()) { 
        return res.status(400).json({message : "Date must be in DD/MM/YYYY format"})
    }

    const busesConnectingCities = await Bus.find({'busRoute.cityName' : {$all : [sourceCity, destinationCity]}})
    const busesOnRoute = getBusesOnRoute(busesConnectingCities, sourceCity, destinationCity)

    if(!busesOnRoute?.length > 0) { 
        return res.status(404).json({message : "No Routes Availalbe"})
    }

    const busesAvailableOnDay = getBusesAvailableOnDay(busesOnRoute, dateObj)

    if(!busesAvailableOnDay?.length > 0) {
        return res.status(404).json({message : "No Routes Availalbe on selected day"})
    }

    const filteredBuses = filterOutFullBuses(busesAvailableOnDay, date)
    const finalBuses = filteredBuses.map(addPricePerSeat(sourceCity, destinationCity))

    res.json(finalBuses)
}

module.exports = handleListBuses