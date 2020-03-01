const db = require('../db/lib/mysqlAdapter')

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
