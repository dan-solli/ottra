var express = require('express')

const jwtMiddleware = require('express-jwt-middleware')
var jwtCheck = jwtMiddleware(process.env.JWT_SECRET_ACCESS)

module.exports = function(app)
{
	let r = express.Router();

	r.use('/1/auth', (require('./../api/auth.controller')))

	r.use(jwtCheck)

	r.use('/1/message', (require('./../api/message.controller')));

/*
	r.use('/1/geography', (require('./geography')(app, driver)));
	r.use('/1/location', (require('./location')(app, driver)));
	r.use('/1/task', (require('./task')(app, driver)));
	r.use('/1/user', (require('./user')(app, driver)));
	r.use('/1/group', (require('./group')(app, driver)));
*/	
	return r;
}
