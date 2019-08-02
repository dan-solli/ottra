var express = require('express')
var bcrypt = require('bcrypt')
const config = require('./../../config')
//var jwt = require('jwt-simple');

var jwt = require('jsonwebtoken')

const helper = require('./../../helpers/create_error')

var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', config.NEO4J), {disableLosslessIntegers: true});

let session = driver.session();

const Msg = require('./../../helpers/messages')(driver)

const tokenList = {}

module.exports = function(app, driver) 
{
	let r = express.Router();
	let session = driver.session();

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
/*				
				response.accessToken = jwt.encode(response, config.JWT_SECRET_ACCESS)
				response.refreshToken = jwt.encode(response, config.JWT_SECRET_REFRESH)
*/

				response.accessToken = jwt.sign(
					response, 
					config.JWT_SECRET_ACCESS,
					{
						expiresIn: config.JWT_ACCESS_TOKEN_LIFE
					}
				)
				response.refreshToken = jwt.sign(
					response, 
					config.JWT_SECRET_REFRESH,
					{
						expiresIn: config.JWT_REFRESH_TOKEN_LIFE
					}
				)

				tokenList[response.refreshToken] = response
				console.log("Tokenlist is now: ")
				console.log(tokenList)				

				console.log("Planning to send response: ")
				console.log(response)

				res.send(response)

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
					),
					Msg.createNewMessage(
						'System',
						uuid,
						'(*) Create a group.',
						'(*) If you belong to a group of people who share tasks, you can create one here!',
						-1,
						'system#usertodo#creategroup'
					)
				])
				.then((response) => {
					console.log("Initial welcome messages created")
					console.log(response)
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

/*				
				response.accessToken = jwt.encode(response, config.JWT_SECRET_ACCESS)
				response.refreshToken = jwt.encode(response, config.JWT_SECRET_REFRESH)
*/

				response.accessToken = jwt.sign(
					response, 
					config.JWT_SECRET_ACCESS,
					{
						expiresIn: config.JWT_ACCESS_TOKEN_LIFE
					}
				)
				response.refreshToken = jwt.sign(
					response, 
					config.JWT_SECRET_REFRESH,
					{
						expiresIn: config.JWT_REFRESH_TOKEN_LIFE
					}
				)

				tokenList[response.refreshToken] = response
				console.log("Tokenlist is now: ")
				console.log(tokenList)				
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

	r.post("/token", (req, res) => {
		const postData = req.body

		if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
			const user = {
				username: postData.username,
				id: postData.uuid
			}
			const token = jwt.sign(
				response, 
				config.JWT_SECRET_REFRESH,
				{
					expiresIn: config.JWT_REFRESH_TOKEN_LIFE
				}
			)
			const response = {
				"token": token
			}
			tokenList[postData.refreshToken].accessToken = token
			res.status(200).json(response)
		}
		else {
			res.status(404).send('Invalid request')
		}
	})

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

function authenticateUser(username, password) {
	let session = driver.session();

	console.log("authenticateUser: User: " + username + "\tPass: " + password)
	return session.run("MATCH (n:User { username: {username}}) return n.password",
		{ username: username })
}

