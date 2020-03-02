/*
 Controller which consists of business logic related to properties
 */
const config = require('config')
const parametersValidator = require('../services/validateParameters')
const getPropertiesValidator = require('../validationSchemas/propertiesValidator')
const utilities = require('../services/utilities')
const propertiesModel = require('../models/properties')

/*
 Get near by properties
 Input: at (eg: at=32.33,-123.34)
 Output: List of nearby properties
 */
const getNearByProperties = async function(params) {
	try {
		// Validate input params
		parametersValidator(getPropertiesValidator.propertiesValidator, params)
		// Hit HERE API to fetch the nearby properties with category = accommodation
		const url = `${config.hereAPI.baseUrl}discover/explore?cat=accommodation&at=${params.at}&apiKey=${config.hereAPI.apiKey}`
		let propertiesNearBy = await utilities.makeExternalCall(
			url,
			'GET',
			'',
			config.hereAPI.timeout
		)
		// Sort the records in ascending order based on it's distance from the input location
		let sortPropertiesByDistance = utilities.sortData(
			propertiesNearBy.data.results.items,
			'distance'
		)
		// Return the data to client
		return {data: sortPropertiesByDistance}
	} catch (e) {
		// Throw unhandled errors or exceptions
		if (e.response && e.response.data && e.response.data.message) {
			throw e.response.data.message
		} else throw e
	}
}

/*
 Get property bookings
 Input: propertyId and page
 Output: List of property's bookings. 1 page consist of 20 records only.
 */
const getPropertyBookings = async function(params) {
	try {
		// Validate input params
		parametersValidator(
			getPropertiesValidator.propertyBookingsValidator,
			params
		)
		// Initialize pageCount as 1
		let resp = {pageCount: -1}
		// Invoke page count function only when the initial(page =1) call is made
		if (params.page == 1) {
			let propertyBookingCount = await propertiesModel.getPropertyBookingsCount(
				params
			)
			resp.pageCount = Math.ceil(
				propertyBookingCount[0].count / config.bookingsPageLimit
			)
		}
		// Fetch property bookings list
		let propertyBookingList = await propertiesModel.getPropertyBookingDetails(
			params
		)
		// Sanitize the dates for the booking list records
		let sanitizedData = sanitizeData(propertyBookingList)
		// return the bookings data and pageCount info
		return {data: sanitizedData, pageCount: resp.pageCount}
	} catch (e) {
		// Throw unhandled errors or exceptions
		if (e.response && e.response.data && e.response.data.message) {
			throw e.response.data.message
		} else throw e
	}
}

// Converts the dates and timestamp of booking records in a human readable format
const sanitizeData = data => {
	const dataLength = data.length
	for (let i = 0; i < dataLength; i++) {
		data[i].checkinDate = utilities.getOnlyDate(data[i].checkinDate)
		data[i].checkoutDate = utilities.getOnlyDate(data[i].checkoutDate)
		data[i].createdDate = utilities.getDateTime(data[i].createdDate)
	}
	return data
}

module.exports = {
	getNearByProperties: getNearByProperties,
	getPropertyBookings: getPropertyBookings
}
