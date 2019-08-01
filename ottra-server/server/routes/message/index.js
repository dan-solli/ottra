var express = require('express')
const config = require('./../../config')
const helper = require('./../../helpers/create_error')

const jwtMiddleware = require('express-jwt-middleware')
var jwtCheck = jwtMiddleware(config.JWT_SECRET)

module.exports = function(app, driver) 
{
	let r = express.Router();
	let session = driver.session();

	r.get('/', jwtCheck, function (req, res) {
		console.log("Token data: ")
		console.log(req.tokenData)
		session
		.run(`
			MATCH (:User { uuid: { uuid }})-[:HAS]->(m:Message) 
			RETURN COLLECT (m { .* , dateTime: apoc.date.format(m.sent) }) AS messages`,
					{ uuid: req.tokenData.id }
		)
		.then(result => res.send(result.records[0].get('messages')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/messages failed: " + error)))
	})

	return r;
}
