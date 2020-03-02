/*
This file consists of all interactions with the DB needed by the bookings controller
*/
const db = require('../db/lib/mysqlAdapter')
const utilities = require('../services/utilities')

/*
 IMPORTANT: Currently I'm fetching the count and then accordingly I'm making booking.
 This approach is not good as I'm making two separate calls to book a property. During high concurrency, there might be a
 possibility that when we select the record then the property was available. But before inserting the booking data
 in the meanwhile, another concurrent request has also read the record and after finding the count as zero, it is also trying to insert the booking
 for same duration for same property. In this scenario, we might end up in having two different bookings for same property for same duration.
 To avoid this we can use stored procedures to ensure transactions and consistency in the system. Refer to the bottom of the file(./db/dbQueries.sql) for stored procedure with name: bookProperty. The version of Mysql that I'm using doesn't have stored procedures support, that's why I'm not able to implement it here.
 */

/*
 Fetch bookings count from DB for specified checkIn and checkOut date
 Input: checkIn, checkOut date and propetyId
 Output: Count of property bookings for specified duration
 */
const checkIfPropertyAvailable = params => {
	return new Promise(function(resolve, reject) {
		// const makeBooking = 'CALL bookProperty()'
		const checkIfBookingPossible =
			'SELECT count(id) as isPropertyBooked FROM `bookings` WHERE `checkout_date` >= ? and `checkin_date` <= ? and property_id = ?;'
		db.readConnection.query(
			checkIfBookingPossible,
			[params.checkInDate, params.checkOutDate, params.propertyId],
			function(err, resp) {
				if (err) reject(err)
				else resolve(resp)
			}
		)
	})
}

/*
 Insert in bookings table to ensure booking of a property
 Input: 'propertyId','numOfGuests','checkInDate','checkOutDate','firstName','lastName','email','contactNumber','countryCode'
 Output: booking data inserted and return booking id
 */
const bookTheProperty = params => {
	return new Promise(function(resolve, reject) {
		// Generate an unique bookingId
		const bookingId = utilities.generateBookingId()
		const makeBooking =
			'INSERT INTO `bookings`( `property_id`, `num_of_guests`, `checkin_date`, `checkout_date`, `booking_id`, `first_name`, `last_name`, `email`, `country_code`, `contact_number`, `created_at`) VALUES (?,?,?,?,?,?,?,?,?,?, now())'
		db.writeConnection.query(
			makeBooking,
			[
				params.propertyId,
				params.numOfGuests,
				params.checkInDate,
				params.checkOutDate,
				bookingId,
				params.firstName,
				params.lastName,
				params.email,
				params.countryCode,
				params.contactNumber
			],
			function(err) {
				if (err) reject(err)
				else resolve({bookingId: bookingId})
			}
		)
	})
}

module.exports = {
	checkIfPropertyAvailable: checkIfPropertyAvailable,
	bookTheProperty: bookTheProperty
}
