const BusStatus = require('../../model/BusStatus')
const moment = require('moment')
const Bus = require('../../model/Bus')

const handleGetBusStatus = (req, res) =>{
    const {busId, date} = req.query;

    if(!busId) return res.status(400).json({message : 'missing required param busId : string'})
    if(!date) return res.status(400).json({message : 'missing required param date: "DD/MM/YYYY"'})

    console.log('busId : ', busId);
    console.log('date : ', date);

    const freshBusStatus = { busId, date, bookedSeats: [] }
    BusStatus.findOne({busId, date}).then(document => {
        if(!document){
            return Bus.findOne({busId}).then(data => {
                if(data){
                    BusStatus.create(freshBusStatus).then(status => {
                        res.json(status);
                    })
                } else {
                    res.sendStatus(500);
                }
            })
        }
        res.json(document)
        console.log(document);
    }).catch(err => {
        console.log("Error, ", err, {...err});
        res.sendStatus(500);
    })
}

module.exports = handleGetBusStatus;




