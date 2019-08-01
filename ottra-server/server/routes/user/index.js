var express = require('express')
var bcrypt = require('bcrypt')
const config = require('./../../config')
var jwt = require('jwt-simple');

const helper = require('./../../helpers/create_error')

var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', config.NEO4J), {disableLosslessIntegers: true});

let session = driver.session();

const Msg = require('./../../helpers/messages')(driver)

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
/*
	r.get('/:userid/locations', function (req, res) {
		session
		.run("MATCH (:User { uuid: { uuid }})-[r*1..3]->(l:Location) RETURN COLLECT (l { .* }) AS locations", 
			{ uuid: req.params.userid })
		.then(result => res.send(result.records[0].get('locations')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/user/:userid/location failed: " + error)))
	})
*/
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

	// Create new user
	r.post('/', function (req, res) {
		let username = req.body.username;
		let password = req.body.password;
		let uuid = '';

		console.log("Post called.")
		session.run("MATCH (n:User { username: {username} }) return n.password AS passwdhash", 
			{ username: username })
		.then( function(result) {
			console.log("We got a result.")
			if (result.records.length !== 0) {
				return Promise.reject("Whatever the fuck");				
			} else {
				return Promise.resolve();
				console.log("Catch if user exists. It doesn't")
			}
		})
		.then (() => createUser(username, password))
		.then (() => {
			console.log("User has been created.")
			getUserID(username)
			.then(function(result) {
				console.log("User ID has been found")
				uuid = result.records[0].get('id')
	
				let response = {
					username: username,
					id: uuid,
				};
				response.token = encodeJWTToken(response);
				console.log("Planning to send response: ")
				console.log(response)

				console.log("Creating new-user messages: ")
				console.log("Msg is: " + JSON.stringify(Msg, null, 2))
				Promise.all([
					Msg.createNewMessage(
						'System',
						uuid,
						'(*) Complete your user profile.',
						'(*) You now have a new user! Complete your user profile!',
						-1,
						'system#usertodo#profile-settings'
					),
					Msg.createNewMessage(
						'System',
						uuid,
						'(*) Customize your user experience.',
						'(*) Take a look at how you can customize your user experience with Ottra!',
						-1,
						'system#usertodo#general-settings'
					),
					Msg.createNewMessage(
						'System',
						uuid,
						'(*) Start creating your home.',
						'(*) Time to create your home, populate it with rooms etc!',
						-1,
						'system#usertodo#createlocation'
					)
				])
				.then((response) => {
					console.log("Initial welcome messages created")
					console.log(response)
					res.send(response)
				})
				.catch((err) => {
					console.log("Let's fail the creation of user messages in silence.")
					console.log(err)
				})
			})
		})
		.catch (function(error) {
			console.log("What's up? : " + error)
		})
	});

	r.post("/authenticate", (req, res) => {  
		let username = req.body.username;
		let password = req.body.password;
		let hash = '';

		authenticateUser(username, password)
		.then(function(result) {
			console.log("Success")
			hash = result.records[0].get('n.password');
			console.log("Hash from DB: " + hash)
		})
		.then(() => comparePassword(password, hash))
		.then(() => {
			getUserID(username)
			.then (function (record) {
				uuid = record.records[0].get('id');
				console.log("We got us uuid " + uuid + " for user " + username);

				let response = {
					username: username,
					id: uuid
				};

				response.token = encodeJWTToken(response);
				res.send(response);
			})
			.catch( function(err) {
				res.status(500).send(helper.createError("Det blev något fel..." + err))
			})
		})
		.catch(function(err) {
			res.status(401).send(helper.createError("Invalid user or pass: " + err))
		})
	});

	r.get("/logout", (req, res) => {  
		req.logout()
		console.log("User logged out.")
		res.send();
	});

	return r;
}

/////////////////////////////////////////////////////
/// Functions 

function comparePassword(password, hash)
{
	return bcrypt.compare(password, hash);
}

function createPassword(passwd) {
	var salt = bcrypt.genSaltSync(config.BCRYPT_ROUNDS);
	var hash = 	bcrypt.hashSync(passwd, salt);

	return hash;
}

function createUser(username, password) {
	let session = driver.session();

	console.log("Inside createUser(" + username + ", " + password + ")")
	let hash = createPassword(password);
	console.log("Hash " + hash + " has been created")
	return session.run("CREATE (:User { password: {hash}, username: {username} })",
		{ hash, username })
}

function getUserID(username) {
	let session = driver.session();

	return session.run("MATCH (n:User { username: {username} }) return n.uuid as id",
		{ username: username })
}

function encodeJWTToken(payload) {
	return jwt.encode(payload, config.JWT_SECRET)
}

function authenticateUser(username, password) {
	let session = driver.session();

	console.log("authenticateUser: User: " + username + "\tPass: " + password)
	return session.run("MATCH (n:User { username: {username}}) return n.password",
		{ username: username })
}

