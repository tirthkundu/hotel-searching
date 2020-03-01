
const config = require('config')
const parametersValidator = require('../services/validateParameters');
const bookingsValidator = require('../validationSchemas/bookingsValidator');
const utilities = require('../services/utilities');
const bookingModel = require('../models/bookings');
const messages = require('../services/messages');

const bookProperty = async function (params) {
    try {
        parametersValidator(bookingsValidator.bookPropertyValidator, params)
        const url = `${config.hereAPI.baseUrl}places/${params.propertyId};context=${config.hereAPI.context}?app_id=${config.hereAPI.appId}&app_code=${config.hereAPI.appCode}`
        const checkIfPropertyExists = await utilities.makeExternalCall(url,'GET', '',  config.hereAPI.timeout)
        const checkIfPropertyAvailable = await bookingModel.checkIfPropertyAvailable(params);
        if(checkIfPropertyAvailable[0].isPropertyBooked == 0){
            const makeBooking = await bookingModel.bookTheProperty(params);
            return ({"data":{"MsgTxt":"Booking done successfully", "BookingId":makeBooking.bookingId}})
        }else{
            return (messages.getMessageDetails("MG003"))
        }

    }
    catch(e){
        if(e.response && e.response.data && e.response.data.message){
            throw e.response.data.message
        }
        else throw e;
    }

}

module.exports = {
    bookProperty : bookProperty
};