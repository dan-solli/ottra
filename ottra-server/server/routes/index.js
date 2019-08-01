var express = require('express')

module.exports = function(app, driver)
{
	let r = express.Router();

	r.use('/1/geography', (require('./geography')(app, driver)));
	r.use('/1/location', (require('./location')(app, driver)));
	r.use('/1/task', (require('./task')(app, driver)));
	r.use('/1/user', (require('./user')(app, driver)));
	r.use('/1/message', (require('./message')(app, driver)));

	return r;
}

//express;