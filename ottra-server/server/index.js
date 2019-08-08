require('dotenv').config()

const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser');
//const cookieSession = require('cookie-session')


const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(
	process.env.NEO4J_URL, 
	neo4j.auth.basic(
		process.env.NEO4J_USERNAME, 
		process.env.NEO4J_PASSWORD
	), {
		disableLosslessIntegers: true
	}
);

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 

/*
app.use(cookieSession({ 
	name: process.env.COOKIE_SESSION_NAME,
	secret: process.env.COOKIE_SESSION_SECRET,
	maxAge: process.env.COOKIE_SESSION_MAXAGE
}))
*/

/////////////////////////////////////////////////////////////////////////////
/// Routing here
/////////////////////////////////////////////////////////////////////////////

const routes = require('./routes')(app, driver);

app.use('/api', routes);


module.exports = app;

app.listen(process.env.SERVER_PORT);
console.log("Server listening to port " + process.env.SERVER_PORT);
