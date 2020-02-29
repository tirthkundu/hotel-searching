let express = require("express");
const config = require("config"),
      bodyParser = require('body-parser'),
      logger = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(logger('combined'));

require("./routes/healthCheck")(app);


const port = process.env.PORT || config.express.port || 3005;
const host = process.env.HOST || config.express.host || 'localhost';
express = { host: '', port: port };

app.listen(express, function() {
    console.log(
        'Node server listening on %s:%d within %s environment',
        host, port, app.set('env')
    );
});
