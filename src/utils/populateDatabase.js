const defaultData = [
    {
        busRoute : {
            "banglore" : {
                "stopNumber": 1,
                "stopLocations" : [
                    {address : ""}
                ],
                departurTime : "String"
            }
        },
    }
]


// clear && update database with above data.

/* Banglore (
        "Jayanagar" : "Jayanagar, 4th Block Bengaluru",
        "BTM Layout" : "Near metro pillar number 164, opposite diwakar travels",
        "Madiwala" : "Next to Venkateshwar Hospital, near savoury",
        "Rajaji Nagar" : "No. 68, 1st Main Road, 1st Block, Dr. Rajkumar Road, Opposite Subramanya Nagar Police Station",
    )
 * Kolar (
        "Kolar" : "Medical Collage flyover starting, opp. woodies restaurant"
    )
 * Vellure (
        "New bus stand" : "Near deepam hotel"
    )
 * Tirupati (
        "RTC Bus Stand" : "New sairam travels, opp. RTC Bus Stand",
        "Srinivasam" : "Opp. srinivasa guest house, shop no. 18, municipal complex"
    )
 * Nellure (
        "Bus Stand" : "Mini bypass road"
    )
 * Ongole (
        "RTC Bus Stand" : "Ongole" 
    )
 * Guntur (
        "Guntur Bypass" : "Guntur Bypass"
    )
 * Vijaywada (
        "Police Control Room" : "Vijaywada"
    )
 * Kakinada (
        "APSP" : "Opp. first gate",
        "Achampeta" : "Achampeta Junction, Kakinada",
        "Sarpavaram Junction" : "Sarpavaram Junction, Kakinada"
    )
 * Vishakha Pattanam (
        "Rama Talkies" : "Rama Talkies, Vishakha Pattanam",
        "MVP Colony" : "MVP Colony, Vishakha Pattanam",
        "Geetam University" : "Geetam University, Vishakha Pattanam",
        "Madhurawada" : "Madhurawada, Vishakha Pattanam",
    )
 * Srikakulam (
        "Srikakulam" : "Srikakulam Bypass road"
    )
 * IchhaPuram (
        "Icchapuram" : "Icchapuram, NH-5 Bypass"
    )
 * Brahmapur (
        "Brahmapur" : "Entrance Flyover"
    )
 * Khordha (
        "Khordha" : "Khordha"
    )
 * Bhubaneswar (
        "Orange Tours" : "Orange Tours & Travels, Mahima Mishra Lane, Opp. Baramunda Bus Stand"
    )
*/


/**
 * Hyderabad
 * Nizamabad
 * Hinganghat
 * Nagpur
 * Jabalpur
 * Katni
 * Rewa
 * Mirzapur
 * Bhabua
 * Arrah
 * Patna
 */

/**
 * Jammu
 * Samba
 * Kathua
 * Nurpur
 * Shahpur
 * Gaggal
 * Nagrota Bagwan
 * Palampur
 * Baijnath
 * Jogindar Nagar
 * Padhar
 * Kamand
 * Bajaura
 * Bhuntar
 * Mohal
 * Naggar
 * Manali
 */

/**
 * Pune
 * Malegao
 * Dhule
 * Ratlaam
 * Mansaur
 * Neemuch
 * Chittor Garh
 * Bhilwara
 * Kishan Garh
 * Jaiput
 * New Delhi








// const get45AvailableSeats = () => {
//     const seats = []
//     for(let i=1 i<=45 i++){
//         seats.push({
//             seatNumber : i,
//             status : "Available"
//         })
//     }
//     return seats
// } 
// router.get('/add-new-bus', async (req, res) => {
//     const result = await Bus.create({
//         busId : "Banglore-Bhubaneswar Express",
//         busType : "Volvo, Non A/C Sleeper",
//         numberOfStops : 4,
//         priceFromOriginToEnd : 2000,
//         numberOfSeats : 45,
//         seatLayout : "2X2",
//         aminities : ["Wifi", "1 Rest Stop", "Charging Socket"],
//         busRoute : [
//             {   cityName : "banglore",
//                 cityId : "banglore-route-1",
//                 stopNumber : 1,
//                 departureTime : "08:45 PM"
//             },
//             {   cityName : "tirupati",
//                 cityId : "tirupati-route-1",
//                 stopNumber : 2,
//                 departureTime : "11:45 PM"
//             },
//             {   cityName : "vijaywada",
//                 cityId : "vijaywada-route-1",
//                 stopNumber : 3,
//                 departureTime : "02:00 AM"
//             },
//             {   cityName : "bhubaneswar",
//                 cityId : "bhubaneswar-route-1",
//                 stopNumber : 4,
//                 departureTime : "08:45 AM"
//             }
//         ], 
//         ratings : {
//             rating : 4.6,
//             totalRatings : 413
//         },
//         seatStatuses : get45AvailableSeats(),
//         runningDays : ["Monday", "Wednesday", "Friday"]
//     })
//     console.log(result)
//     res.json(result)
// })



*/

