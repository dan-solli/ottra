var express = require('express')

module.exports = function(app, driver) {
	let r = express.Router();
	let session = driver.session();	

	r.get('/location/:loc_id', function (req, res) {
		session		
		.run("MATCH (l:Location { uuid: { uuid }}) RETURN l { l.* })", 
			{ uuid: req.params.loc_id })
		.then(result => res.send(result.records[0].get('l')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/location/:id failed: " + error)))
	})

	r.get('/location/:loc_id/rooms', function (req, res) {
		session		
		.run("MATCH (:Location { uuid: { uuid }})-[:OWNS]->(t:Task) RETURN COLLECT (t { .* }) AS tasks", 
			{ uuid: req.params.loc_id })
		.then(result => res.send(result.records[0].get('tasks')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/task/ failed: " + error)))
	})

	r.get('/location/room/:room_id/storages', function (req, res) {
		session
		.run("MATCH (:User { uuid: { uuid }})-[:OWNS]->(t:Task) RETURN COLLECT (t { .* }) AS tasks", 
			{ uuid: req.params.room_id })
		.then(result => res.send(result.records[0].get('tasks')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/task/ failed: " + error)))
	})

/*	
	r.get('/user/:userid', function (req, res) {
		session
		.run("MATCH (:User { uuid: { uuid }})-[:OWNS]->(t:Task) RETURN COLLECT (t { .* }) AS tasks", 
			{ uuid: req.params.userid })
		.then(result => res.send(result.records[0].get('tasks')))
		.catch(error => res.status(500).send(helper.createError("GET /api/i/task/ failed: " + error)))
	})
*/
	r.post('/location', function(req, res) {

		console.log("location.POST: Called")

/*
		// extract user from cookie/jwttoken

		session
		.run(`
MATCH (u:User { uuid : { creator } })
CREATE (u)-[]

		console.log("Inside createUser(" + username + ", " + password + ")")
		let hash = createPassword(password);
		console.log("Hash " + hash + " has been created")
		return session.run("CREATE (:User { password: {hash}, username: {username} })",
			{ hash, username })

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
*/

	})

	return r;
}
