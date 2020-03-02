/*
 This file is used for joi validations on input params
 */
const joi = require('joi')

/*
 Validates body or query params
 Input: Validation schema and parameters
 Output: Return true if validations passed, otherwise throws error for failed validation
 */
const validateParams = (schema, params) => {
	const {error} = joi.validate(params, schema)
	const valid = error == null
	if (valid) {
		return true
	} else {
		const {details} = error
		const message = details.map(i => i.message).join(',')
		throw message
	}
}
module.exports = validateParams
