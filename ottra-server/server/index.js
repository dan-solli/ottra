
console.debug("Server starting up!")
console.debug("Parsing configuration...")

const result = require('dotenv').config()
if (result.error) {
	console.error("Failed to parse configuration file")
}

console.debug("Importing basic modules...")
const express = require('express')
const logger = require('morgan');

const busboy = require('express-busboy')
//const bodyParser = require('body-parser');
//const cookieSession = require('cookie-session')

console.debug("Creating express application...")
const app = express();

busboy.extend(app, {
	upload: true,
	path: process.env.UPLOAD_CONTENT_PATH,
})

console.debug("Set express configuration...")
app.use(logger('dev'));
//app.use(bodyParser.json()); 
//app.use(bodyParser.urlencoded({ extended: false })); 

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

console.debug("Setting up routes...")

const routes = require('./routes');

app.use('/api', routes);

module.exports = app;

app.listen(process.env.SERVER_PORT);
console.log("Server listening to port " + process.env.SERVER_PORT);
