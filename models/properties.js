const db = require('../db/lib/mysqlAdapter')

const getPropertyBookingDetails = params => {
	return new Promise(function(resolve, reject) {
		const propertyBookingsQuery =
			'SELECT  `property_id` as propertyId, `num_of_guests` as numOfGuests, `checkin_date` as checkinDate, `checkout_date` as checkoutDate, `booking_id` as bookingDate, `first_name` as firstName, `last_name` as lastName, `email`, `country_code` as countryCode, `contact_number` as contactNumber, `created_at` as createdDate FROM `bookings` WHERE property_id = ? order by id desc limit 20;'
		db.readConnection.query(
			propertyBookingsQuery,
			[params.propertyId],
			function(err, resp) {
				if (err) reject(err)
				else resolve(resp)
			}
		)
	})
}

module.exports = {
	getPropertyBookingDetails: getPropertyBookingDetails
}
