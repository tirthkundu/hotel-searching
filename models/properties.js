/*
 This file consists of all interactions with the DB needed by the properties controller
 */
const db = require('../db/lib/mysqlAdapter')
const config = require('config')

/*
 Fetch a property's bookings data, max 20 per page
 Input: propertyId and page
 Output: Property's booking list
 */
const getPropertyBookingDetails = params => {
	return new Promise(function(resolve, reject) {
		// Calculate the starting index w.r.t page
		const startingPageRecord =
			parseInt(params.page - 1) * config.bookingsPageLimit
		const propertyBookingsQuery =
			'SELECT  `id`, `property_id` as propertyId, `num_of_guests` as numOfGuests, `checkin_date` as checkinDate, `checkout_date` as checkoutDate, `booking_id` as bookingId, `first_name` as firstName, `last_name` as lastName, `email`, `country_code` as countryCode, `contact_number` as contactNumber, `created_at` as createdDate FROM `bookings` WHERE property_id = ? order by id desc limit ?,?;'
		db.readConnection.query(
			propertyBookingsQuery,
			[params.propertyId, startingPageRecord, config.bookingsPageLimit],
			function(err, resp) {
				if (err) reject(err)
				else resolve(resp)
			}
		)
	})
}

/*
 Fetch a property's bookings data count
 Input: propertyId
 Output: Property's booking data count
 */
const getPropertyBookingsCount = params => {
	return new Promise(function(resolve, reject) {
		const propertyBookingCountQuery =
			'SELECT count(1) as count FROM `bookings` WHERE property_id = ?;'
		db.readConnection.query(
			propertyBookingCountQuery,
			[params.propertyId],
			function(err, resp) {
				if (err) reject(err)
				else resolve(resp)
			}
		)
	})
}

module.exports = {
	getPropertyBookingDetails: getPropertyBookingDetails,
	getPropertyBookingsCount: getPropertyBookingsCount
}
