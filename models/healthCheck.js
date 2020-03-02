/*
 This file makes call to DB to check health
 */
const db = require('../db/lib/mysqlAdapter')

/*
 Ping the DB
 Input: ''
 Output: Success if query return results otherwise error
 */
const pingDB = () => {
	return new Promise(function(resolve, reject) {
		const healthQuery = 'SELECT 1'
		db.readConnection.query(healthQuery, function(err, resp) {
			if (err) reject(err)
			else resolve(resp)
		})
	})
}

module.exports = {
	pingDB: pingDB
}
