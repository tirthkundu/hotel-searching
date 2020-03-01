const config = require('config')
const parametersValidator = require('../services/validateParameters')
const getPropertiesValidator = require('../validationSchemas/propertiesValidator')
const utilities = require('../services/utilities')
const propertiesModel = require('../models/properties')

const getNearByProperties = async function(params) {
	try {
		parametersValidator(getPropertiesValidator.propertiesValidator, params)
		const url = `${config.hereAPI.baseUrl}discover/explore?cat=accommodation&at=${params.at}&apiKey=${config.hereAPI.apiKey}`
		let propertiesNearBy = await utilities.makeExternalCall(
			url,
			'GET',
			'',
			config.hereAPI.timeout
		)
		let sortPropertiesByDistance = utilities.sortData(
			propertiesNearBy.data.results.items,
			'distance'
		)
		return {data: sortPropertiesByDistance}
	} catch (e) {
		if (e.response && e.response.data && e.response.data.message) {
			throw e.response.data.message
		} else throw e
	}
}

const getPropertyBookings = async function(params) {
	try {
		parametersValidator(
			getPropertiesValidator.propertyBookingsValidator,
			params
		)
		let propertyBookingList = await propertiesModel.getPropertyBookingDetails(
			params
		)
		let sanitizedData = sanitizeData(propertyBookingList)
		return {data: sanitizedData}
	} catch (e) {
		if (e.response && e.response.data && e.response.data.message) {
			throw e.response.data.message
		} else throw e
	}
}

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
