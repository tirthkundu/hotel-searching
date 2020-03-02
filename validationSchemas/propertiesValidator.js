/*
 This file consists of validation schemas for properties route.
 'Fetch near by properties' validation and 'fetch property's bookings' validation schemas are mentioned below.
 */
const joi = require('joi')

const getPropertiesSchema = {
	propertiesValidator: joi.object().keys({
		at: joi
			.string()
			.regex(/^[-+]?[0-9]*\.?[0-9]+(,[-+]?[0-9]*\.?[0-9]+)+/)
			.required()
	}),
	propertyBookingsValidator: joi.object().keys({
		propertyId: joi.string().required(),
		page: joi.number().required()
	})
}

module.exports = getPropertiesSchema
