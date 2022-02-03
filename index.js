require('dotenv').config()
const connectDB = require('./src/configs/dbConn')
const mongoose = require('mongoose')
const path = require('path')
const moment = require('moment')
const BusStatus = require('./src/model/BusStatus')

mongoose.plugin((schema) => {
    if (!schema.options.toObject) schema.options.toObject = {};
    schema.options.toObject.transform = (doc, ret, options) => {
        delete ret['_id'];
        delete ret['__v'];
        return ret;
    }
});

connectDB()

const addBus = () => {
    const bus =  {
        busId : "Banglore-Bhubaneswar Seater Express",
        busType : "Volvo",
        priceFromOriginToEnd : 2000,
        numberOfSeats : 45,
        isSleeper: false,
        aminities : ["Wifi", "1 Rest Stop", "Charging Socket"],
        seatLayout : {
            numberOfDecks : 1,
            seatsOnLeft : 2,
            seatsOnRight : 2,
            numberOfRows : 11,
            reservedForLadiesSeats : [1,2,3,4,5,8]
        },
        busRoute : [
            {   cityName : "banglore",
                cityId : "banglore-route-1",
                stopNumber : 1,
                departureTime : "08:45 PM",
                journeyTimeInMins: 0
            },
            {   cityName : "tirupati",
                cityId : "tirupati-route-1",
                stopNumber : 2,
                departureTime : "11:45 PM",
                journeyTimeInMins: (3*60)
            },
            {   cityName : "vijaywada",
                cityId : "vijaywada-route-1",
                stopNumber : 3,
                departureTime : "02:00 AM",
                journeyTimeInMins:(5*60+15)
            },
            {   cityName : "bhubaneswar",
                cityId : "bhubaneswar-route-1",
                stopNumber : 4,
                departureTime : "08:45 AM",
                journeyTimeInMins: (9*60)
            }
        ], 
        ratings : {
            rating : 4.6,
            totalRatings : 413
        },
        runningDays : ["Monday", "Wednesday", "Friday"]
    }

    const Bus = require('./src/model/Bus')
    return Bus.create(bus)
}



const addLocations = () => {
    const locations = [
        {
            cityId : "tirupati-route-1",
            locations : [
                {
                    locationName : "RTC Bus Stand",
                    address : "New sairam travels, opp. RTC Bus Stand",
                    departureTime: "11:45 PM"
                },
                {
                    locationName : "Srinivasam",
                    address : "Opp. srinivasa guest house, shop no. 18, municipal complex",
                    departureTime: "11:30 PM"
                }
            ]
        },
        {
            cityId : "bhubaneswar-route-1",
            locations : [
    
                {
                    locationName : "Orange Tours",
                    address : "Orange Tours & Travels, Mahima Mishra Lane, Opp. Baramunda Bus Stand",
                    departureTime: "08:45 PM"
                },
            ]
        },
        {   cityId : "vijaywada-route-1",
            locations : [
                {
                    locationName : "Vijaywada",
                    address : "Police Control Room",
                    departureTime: "02:00 AM"
                }
            ]
        }
    ]
    const Location = require('./src/model/Location')
    return Location.create(locations)
}

const addBusStatus = async () => {
    const BusStatus = require('./src/model/BusStatus')
    const newBooking = [5]
    const bookedSeats = newBooking.map(
        seatNumber => ({
            seatNumber, 
            status : 'Booked', 
            from: 0,
            to: 1
        })
    ) 
    return BusStatus.updateOne(
        {busId: 'newBus', date: '25/04/2025'},
        {$push: {bookedSeats: {$each: bookedSeats}}},
        {upsert: true}
    ).exec();
}

// mongoose.connection.once('open', () => {
//     addBusStatus().then(result => {
//         console.log(result)
//     }).catch(err => {
//         console.error(err);
//     });
// })

console.log(moment().format('DD/MM/YYYY'));