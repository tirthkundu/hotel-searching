/*
 Controller which consists of business logic related to bookings
*/
const config = require('config')
const parametersValidator = require('../services/validateParameters')
const bookingsValidator = require('../validationSchemas/bookingsValidator')
const utilities = require('../services/utilities')
const bookingModel = require('../models/bookings')
const messages = require('../services/messages')

/*
 Book a property for given dates.
 One property can be rented out to one user with guests less than 10 for a particular range of dates if no other
 user has booked the property during the overlapping period.
 Input: 'propertyId','numOfGuests','checkInDate','checkOutDate','firstName','lastName','email','contactNumber','countryCode'
 Output: Success with bookingId or error if booking is not possible
 */
const bookProperty = async function(params) {
	try {
		// Validate input params
		parametersValidator(bookingsValidator.bookPropertyValidator, params)
		// Check if property exists
		const url = `${config.hereAPI.baseUrl}places/${params.propertyId};context=${config.hereAPI.context}?app_id=${config.hereAPI.appId}&app_code=${config.hereAPI.appCode}`
		await utilities.makeExternalCall(url, 'GET', '', config.hereAPI.timeout)
		// Check if a property is available for desired dates
		const checkIfPropertyAvailable = await bookingModel.checkIfPropertyAvailable(
			params
		)
		if (checkIfPropertyAvailable[0].isPropertyBooked == 0) {
			// If property is available, make a booking
			const makeBooking = await bookingModel.bookTheProperty(params)

			// Booking done successfully
			return {
				data: {
					msgTxt: 'Booking done successfully',
					bookingId: makeBooking.bookingId
				}
			}
			// Error condition when property is not available
		} else {
			return messages.getMessageDetails('MG003')
		}
	} catch (e) {
		// Throw unhandled errors or exceptions
		if (e.response && e.response.data && e.response.data.message) {
			throw e.response.data.message
		} else throw e
	}
}

module.exports = {
	bookProperty: bookProperty
}
