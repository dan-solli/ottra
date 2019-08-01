var express = require('express')
const helper = require('./../../helpers/create_error')

module.exports = function(app, driver)
{
	let r = express.Router();
	let session = driver.session();

	r.get('/user/:userid', function (req, res) {
		session
		.run("MATCH (:User { uuid: { uuid }})-[:OWNS]->(t:Task) RETURN COLLECT (t { .* }) AS tasks", 
			{ uuid: req.params.userid })
		.then(result => res.send(result.records[0].get('tasks')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/task/ failed: " + error)))
	})

	return r;


}

/*	
	r.get('/', function (req, res) {
		let list = [];
		session
			.run('MATCH (t:Task)-[:EXECUTES]->(s:Step) ' +
					'WITH t, SUM(duration(s.duration)) AS taskDuration ' +
					'RETURN t { .name, .uuid, taskDuration: taskDuration.seconds, parent: false } AS task ' +
					'UNION ' +
					'MATCH (t2:Task)-[:SUBTASK]->(t:Task)-[:EXECUTES]->(s:Step) ' +
					'WITH t2, SUM(duration(s.duration)) AS taskDuration ' +
					'RETURN t2 { .name, .uuid, taskDuration: taskDuration.seconds, parent: true } AS task')
			.then(function(result) {
				result.records.forEach(function (record) {
					list.push(record.get('task'));
				})
				res.send(list);
			})
			.catch(function(error) {
				console.log("Error: " + error)
			})
	})

	r.get('/:taskid', function (req, res) {
		var href;

		session
			.run('MATCH (t:Task { uuid: {idParam} })-[:EXECUTES]->(s:Step) ' +
				   'WITH t, SUM(duration(s.duration)) AS taskDuration ' +
				   'RETURN t { .name, .uuid, taskDuration: taskDuration.seconds }', { idParam: req.params.taskid})
			.then(function (result) {
				href = result.records[0].get('t');
				href.steps = [];
				session
					.run('MATCH (t:Task { uuid: {idParam} })-[r]->(s:Step) RETURN s { .description, .uuid, .duration  } ORDER BY r.order ',
						{ idParam: req.params.taskid})
					.then(function (result) {
						result.records.forEach(function(record) {
							let x = record.get('s');
							href.steps.push(x)
						})
					})
					.catch(function(error) {
						console.log("Error: " + error)
					})
					.then(function() {
						res.send(href);
					})
			})
			.catch(function(error) {
				console.log("Error: " + error);
		})
	})
*/
