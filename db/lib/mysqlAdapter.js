/*
This file is responsible for creating DB connections with master and slave hosts
Currently the master and slave hosts are same as we don't have master-slave infra. But we can have different endpoints in future
*/
const mysql = require('mysql')
const config = require('config')

// Writer pool creation
const writeConnection = mysql.createPool({
	host: config.db.master.host,
	user: config.db.master.user,
	password: config.db.master.password,
	database: config.db.master.database,
	connectionLimit: config.db.master.connectionPoolLimit,
	port: config.db.master.port
})

// If test environment then skip, otherwise create writer connection
if (process.env.NODE_ENV !== 'test') {
	writeConnection.getConnection(function(err) {
		if (err) {
			console.error('error connecting master: ' + err.stack)
			return
		}
	})
}
// Reader pool creation
const readConnection = mysql.createPool({
	host: config.db.slave.host,
	user: config.db.slave.user,
	password: config.db.slave.password,
	database: config.db.slave.database,
	connectionLimit: config.db.slave.connectionPoolLimit,
	port: config.db.slave.port
})

// If test environment then skip, otherwise create reader connection
if (process.env.NODE_ENV !== 'test') {
	readConnection.getConnection(function(err) {
		if (err) {
			console.error('error connecting to slave: ' + err.stack)
			return
		}
	})
}

module.exports = {
	writeConnection: writeConnection,
	readConnection: readConnection
}
