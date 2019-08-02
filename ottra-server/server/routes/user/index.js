var express = require('express')

const helper = require('./../../helpers/create_error')

module.exports = function(app, driver) 
{
	let r = express.Router();
	let session = driver.session();

	r.get('/:userid/tasks', function (req, res) {
		session
		.run("MATCH (:User { uuid: { uuid }})-[:OWNS]->(t:Task) RETURN COLLECT (t { .* }) AS tasks", 
			{ uuid: req.params.userid })
		.then(result => res.send(result.records[0].get('tasks')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/task/ failed: " + error)))
	})

	r.get('/:userid', function (req, res) {
		var userdata;

		console.log("Calling GET /api/1/user/:userid")

		session
		.run('MATCH (u:User { uuid: { uuid }}) RETURN u { .username, .uuid, .name }',
				{ uuid: req.params.userid })
		.then(function (result) {
			result.records.forEach(function (record) {
				userdata = record.get('u')
			})
			// Get :Settings for user.
			res.send(userdata)
		})
		.catch(function(error) {
			console.log("GET user: " + error)
			res.status(500).send(helper.createError("GET /api/i/user/:id failed: " + error))
		})
	})

	return r;
}
