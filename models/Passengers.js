const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    fullName: String,
    age: String,
    gender: String,
    contact: String,
    address: String,
    identification: String,
    shipName: String,
    routeFrom: String,
    routeTo: String,
    inboundTime: String,
    outboundTime: String,
    operatorName: String,
    wristbandId: String,
    latitude: String,
    longitude: String,
})


module.exports = mongoose.model('Passengers', formSchema)