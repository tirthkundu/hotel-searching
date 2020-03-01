const health = require('../models/healthCheck')

const checkHealth = async function(params) {
	try {
		await health.pingDB(params)
		return 'MG001'
	} catch (e) {
		throw 'MG000'
	}
}

module.exports = {
	checkHealth: checkHealth
}
