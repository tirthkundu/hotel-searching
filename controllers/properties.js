const axios = require('axios')
const config = require('config')
const parametersValidator = require('../services/validateParameters');
const getPropertiesValidator = require('../validationSchemas/getPropertiesValidator');

const getNearByProperties = async function (params) {
    try {
        parametersValidator(getPropertiesValidator.propertiesValidator, params)
        let url = `${config.hereAPI.baseUrl}?at=${params.at}&apiKey=${config.hereAPI.apiKey}`
        let propertiesNearBy = await axios.get(url,{"timeout": config.hereAPI.timeout})
        return ({data:propertiesNearBy.data.results.items})
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