/*
 Controller which consists of function to check health of the system
 */
const health = require('../models/healthCheck')

/*
 Health check call logic
 Input: ''
 Output: Success if systems are working fine or error if db is down
 */
const checkHealth = async function(params) {
	try {
		// Ping the DB to check if it's up and running
		await health.pingDB(params)
		// Return success
		return 'MG001'
	} catch (e) {
		// Return failure
		throw 'MG000'
	}
}

module.exports = {
	checkHealth: checkHealth
}
