const joi = require('joi')

const getPropertiesSchema = {
    propertiesValidator: joi.object().keys({
        at: joi.string().required()
    })

};

module.exports = getPropertiesSchema;