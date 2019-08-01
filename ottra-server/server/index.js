
var express = require('express');

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser'); // BYT
const cookieSession = require('cookie-session')


var config = require("./config.js");
var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', config.NEO4J), {disableLosslessIntegers: true});

const { Weather } = require('openweathermap-apis');

const client = new Weather({
  apiKey: config.OWM_APIKEY
});

const SERVER_PORT = 8089;

app = express();

app.use(logger('dev'));
app.use(bodyParser.json()); // BYT
app.use(bodyParser.urlencoded({ extended: false })); // BYT

app.use(cookieSession({
	name: 'ottrasession',
	keys: ['ohthisisthesecretkey'],
	maxAge: 24 * 60 * 60 * 1000
}))

/////////////////////////////////////////////////////////////////////////////
/// Routing here
/////////////////////////////////////////////////////////////////////////////

let routes = require('./routes')(app, driver);

app.use('/api', routes);


module.exports = app;

app.listen(config.SERVER_PORT);
console.log("Server listening to port " + config.SERVER_PORT);

