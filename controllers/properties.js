
const config = require('config')
const parametersValidator = require('../services/validateParameters');
const getPropertiesValidator = require('../validationSchemas/getPropertiesValidator');
const utilities = require('../services/utilities');

const getNearByProperties = async function (params) {
    try {
        parametersValidator(getPropertiesValidator.propertiesValidator, params)
        const url = `${config.hereAPI.baseUrl}&at=${params.at}&apiKey=${config.hereAPI.apiKey}`
        let propertiesNearBy = await utilities.makeExternalCall(url,'GET', '',  config.hereAPI.timeout)
        let sortPropertiesByDistance = utilities.sortData(propertiesNearBy.data.results.items,'distance')
        return ({data:sortPropertiesByDistance})
    }
    catch(e){
        if(e.response && e.response.data && e.response.data.message){
            throw e.response.data.message
        }
        else throw e;
    }

}

module.exports = {
    getNearByProperties : getNearByProperties
};