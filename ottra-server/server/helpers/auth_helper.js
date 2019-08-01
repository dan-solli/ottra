var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

const config = require('./../config');

var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', config.NEO4J), {disableLosslessIntegers: true});

function userExist(username) {
	let session = driver.session();

  session
	.run("MATCH (n:User { username: {username} }) return n.password AS passwdhash", 
		{ username: username })
	.then(function (result) {
		if (result.records.length === 0) {
			return false;
		} else {
			return true;
		}
	})
	.catch(function(err) {
		console.log("userExist: " + err)
	})
}

function createPassword(passwd) {

	var salt = bcrypt.genSaltSync(config.BCRYPT_ROUNDS);
	var hash = 	bcrypt.hashSync(passwd, salt);

	return hash;
}

async function _comparePassword(password, hash)
{
	console.log("auth_helper._comparePassword(" + password + ", " + hash)
	let match = await bcrypt.compare(password, hash);
	console.log("auth_helper._comparePassword: bcrypt says match is: " + match)
	return match;
}

function createUser(username, hash) {
	let session = driver.session();

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

	console.log("auth_helper.authenticateUser: User: " + username + "\tPass: " + password)
	session.run("MATCH (n:User { username: {username}}) return n.password",
		{ username: username })
	.then(function(result) {
		let hash = result.records[0].get('n.password');
		console.log("auth_helper.authenticateUser: Hash from DB: " + hash)
		return _comparePassword(password, hash)
	})
	.catch (function(error) {
		console.log("auth_helper.authenticateUser: Error: " + error)
		return false;
	})
}

module.exports = {
	userExist: userExist,
	createPassword: createPassword,
	createUser: createUser,
	getUserID: getUserID,
	encodeJWTToken: encodeJWTToken,
	authenticateUser: authenticateUser
};