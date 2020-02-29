let express = require("express");
const config = require("config"),
      bodyParser = require('body-parser'),
      logger = require('morgan');

const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(logger('combined'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

require("./routes/healthCheck")(app);
require("./routes/properties")(app);

app.get('/apitest', function (req, res) {
    res.render('apiTest');
});

const port = process.env.PORT || config.express.port || 3005;
const host = process.env.HOST || config.express.host || 'localhost';
express = { host: '', port: port };

app.listen(express, function() {
    console.log(
        'Node server listening on %s:%d within %s environment',
        host, port, app.set('env')
    );
});
