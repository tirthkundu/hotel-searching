const joi = require('joi')

const bookingsValidator = {
	bookPropertyValidator: joi.object().keys({
		propertyId: joi.string().required(),
		numOfGuests: joi
			.number()
			.integer()
			.less(10)
			.required(),
		checkInDate: joi
			.date()
			.greater('now')
			.required(),
		checkOutDate: joi
			.date()
			.greater(joi.ref('checkInDate'))
			.required(),
		firstName: joi
			.string()
			.max(50)
			.required(),
		lastName: joi
			.string()
			.max(50)
			.required(),
		email: joi
			.string()
			.email({minDomainAtoms: 2})
			.regex(/\+/, {invert: true})
			.required(),
		countryCode: joi
			.string()
			.min(3)
			.max(8)
			.required(),
		contactNumber: joi
			.string()
			.min(8)
			.max(13)
			.required()
	})
}

module.exports = bookingsValidator
