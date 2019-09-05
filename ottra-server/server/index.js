
console.debug("Server starting up!")
console.debug("Parsing configuration...")

const result = require('dotenv').config()
if (result.error) {
	console.error("Failed to parse configuration file")
}

console.debug("Importing basic modules...")
const express = require('express')
const https = require('https')
const fs = require('fs')

const logger = require('morgan');
const busboy = require('express-busboy')

console.debug("Creating express application...")
const app = express();

busboy.extend(app, {
	upload: true,
	path: process.env.UPLOAD_CONTENT_PATH,
})

console.debug("Set express configuration...")
app.use(logger('dev'));

/*
//const cookieSession = require('cookie-session')
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


const content_route = require('./routes/content_route')
app.use('/', content_route)

//app.listen(process.env.HTTP_SERVER_PORT);
//console.log("Server listening to ports " + process.env.HTTP_SERVER_PORT);

/////////////////////////////////////////////////////////////////////////////
/// Setting up https.
/////////////////////////////////////////////////////////////////////////////

console.debug("Setting up https")

https.createServer({
	key: fs.readFileSync(process.env.HTTPS_SERVER_KEY),
	cert: fs.readFileSync(process.env.HTTPS_SERVER_CERT)
}, app).listen(process.env.HTTPS_SERVER_PORT, function() {
	console.log("Server listening to port " + process.env.HTTPS_SERVER_PORT)
})

module.exports = app;
