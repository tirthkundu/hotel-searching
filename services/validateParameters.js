const joi = require('joi');

const validateParams = (schema, params) => {

        const { error } = joi.validate(params, schema);
        const valid = error == null;
        if (valid) {
            return true;
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            console.log("error", message);
            throw message }

}
module.exports = validateParams;