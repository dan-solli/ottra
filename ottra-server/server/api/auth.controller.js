const express = require('express')

const AuthService = require('./../services/auth.service')
const UserService = require('./../services/user.service')

const SendResponse = require('./../infra/response.js')

const r = express.Router();

r.post('/', async function(req, res) {
	console.debug("%s: POST /: called with req.body: %O", __filename, req.body)
	SendResponse.response(res, await UserService.createUser(req.body))
})

r.post("/authenticate", async function(req, res) {
	console.debug("%s: POST /authenticate: called with req.body: %O", __filename, req.body)
	SendResponse.response(res, await UserService.authenticateUser(req.body))
})
		
r.post("/token", async function(req, res) {
	console.debug("%s: POST /token: called with req.body: %O", __filename, req.body)
	SendResponse.response(res, await AuthService.refreshToken(req.body))
})

module.exports = r
