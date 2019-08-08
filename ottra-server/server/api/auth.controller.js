let express = require('express')

const AuthService = require('./../services/auth.service')
const UserService = require('./../services/user.service')

module.exports = function() 
{
	const r = express.Router();

	// Create new user
	r.post('/', function(req, res) {
		res.send(UserService.createUser(req.body))
	})

	r.post("/authenticate", function(req, res) {
		res.send(UserService.authenticateUser(req.body))
	})
			
	r.post("/token", function(req, res) {
		res.send(AuthService.refreshToken(req.body))
	})

	return r;
}
