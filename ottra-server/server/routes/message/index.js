var express = require('express')
const helper = require('./../../helpers/create_error')

module.exports = function(app, driver) 
{
	let r = express.Router();
	let session = driver.session();

	r.get('/', function (req, res) {
		console.log("Token data (does it still exist?!): ")
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
