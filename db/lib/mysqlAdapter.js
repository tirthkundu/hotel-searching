const mysql = require('mysql');
const config = require('config');

const writeConnection = mysql.createConnection({
    host     : config.db.master.host,
    user     : config.db.master.user,
    password : config.db.master.password,
    pool     : config.db.master.connectionPoolLimit,
    port     : config.db.master.port
});

writeConnection.connect(function(err) {
    if (err) {
        console.error('error connecting master: ' + err.stack);
        return;
    }

    console.log('master connected as id ' + writeConnection.threadId);
});


const readConnection = mysql.createConnection({
    host     : config.db.slave.host,
    user     : config.db.slave.user,
    password : config.db.slave.password,
    pool     : config.db.slave.connectionPoolLimit,
    port     : config.db.slave.port
});

readConnection.connect(function(err) {
    if (err) {
        console.error('error connecting to slave: ' + err.stack);
        return;
    }

    console.log('slave connected as id ' + readConnection.threadId);
});

module.exports = {
    writeConnection: writeConnection,
    readConnection: readConnection
}