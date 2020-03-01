const db = require("../db/lib/mysqlAdapter");
const utilities = require('../services/utilities');

const checkIfPropertyAvailable = (params) => {
    return new Promise(function(resolve, reject) {
        // const makeBooking = 'CALL bookProperty()'
        const checkIfBookingPossible = 'SELECT count(id) as isPropertyBooked FROM `bookings` WHERE `checkout_date` >= ? and `checkin_date` <= ?;'
        db.readConnection.query(checkIfBookingPossible,[params.checkInDate, params.checkOutDate], function (err, resp) {
            if(err) reject(err)
            else resolve(resp)
        })
    })
}

const bookTheProperty = (params) => {
    return new Promise(function(resolve, reject) {
        const bookingId = utilities.generateBookingId();
        const makeBooking = 'INSERT INTO `bookings`( `property_id`, `num_of_guests`, `checkin_date`, `checkout_date`, `booking_id`, `first_name`, `last_name`, `email`, `country_code`, `contact_number`, `created_at`) VALUES (?,?,?,?,?,?,?,?,?,?, now())'
        db.writeConnection.query(makeBooking,[params.propertyId, params.numOfGuests, params.checkInDate, params.checkOutDate, bookingId, params.firstName, params.lastName, params.email, params.countryCode, params.contactNumber], function (err, resp) {
            if(err) reject(err)
            else resolve({bookingId: bookingId})
        })
    })
}

module.exports = {
    checkIfPropertyAvailable: checkIfPropertyAvailable,
    bookTheProperty: bookTheProperty
}