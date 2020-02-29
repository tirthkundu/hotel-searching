const health = require('../models/healthCheck')

const checkHealth = async function (params) {
    try {
        const healthCall = await health.pingDB(params)
        return ("MG001")
    }catch(e){
        throw "MG000";
    }

}

module.exports = {
	checkHealth : checkHealth
};