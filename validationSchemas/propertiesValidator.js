const joi = require('joi')

const getPropertiesSchema = {
	propertiesValidator: joi.object().keys({
		at: joi
			.string()
			.regex(/^[-+]?[0-9]*\.?[0-9]+(,[-+]?[0-9]*\.?[0-9]+)+/)
			.required()
	}),
	propertyBookingsValidator: joi.object().keys({
		propertyId: joi.string().required()
	})
}

module.exports = getPropertiesSchema
