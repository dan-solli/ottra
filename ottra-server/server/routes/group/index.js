var express = require('express')
const helper = require('./../../helpers/create_error')

module.exports = function(app, driver) 
{
	let r = express.Router();
	let session = driver.session();

	r.get('/', function (req, res) {
		console.log("[/api/1/group/get]: Token data (does it still exist?!): ")
		console.log(req.tokenData)
		session
		.run(`
			MATCH (:User { uuid: { uuid }})-[:BELONG_TO]->(g:Group) 
			RETURN COLLECT (g { .* }) AS groups`,
					{ uuid: req.tokenData.id }
		)
		.then(result => res.send(result.records[0].get('groups')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/groups failed: " + error)))
	})

	r.post('/', function(req, res) {
		console.log("[/api/1/group/post]: Token data (does it still exist?!): ")
		console.log(req.tokenData)
		session
		.run(`
			MATCH (u:User { uuid : {creator} })
			CREATE (u)-[:BELONG_TO]->(g:Group {
				creator: {creator},
				created: TIMESTAMP(),
				name: {group_name} 
			}) return g as groups`,
			{ 
				creator: req.tokenData.id,
				group_name: req.body.groupName
			}
		)
		.then(function(result) {
			console.log("Result from group creation: ")
			console.log(result)
			console.log("We need to handle invites here")
			res.send(result.records[0].get('groups'))
		})
		.catch(error => res.status(500).send(helper.createError("GET /api/i/groups failed: " + error)))
	})
	return r;
}
