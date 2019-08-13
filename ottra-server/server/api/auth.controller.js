const express = require('express')
const { check, validationResult } = require('express-validator');

const AuthService = require('./../services/auth.service')
const UserService = require('./../services/user.service')

const SendResponse = require('./../infra/response.js')

const r = express.Router();

r.post('/', [
		check('username').isEmail(),
		check('password').isLength({ min: 10 })
	], async function(req, res) {
	console.debug("%s: POST /: called with req.body: %O", __filename, req.body)
	const errors = validationResult(req) 
	if (!errors.isEmpty()) {
		SendResponse.response(res, [ null, {
				status: 'failed',
				message: 'Invalid arguments',
				code: 422
			}
		])
	} else {
		SendResponse.response(res, await UserService.createUser(req.body))
	}
})

r.post("/authenticate", [
		check('username').isEmail(),
		check('password').isLength({ min: 10 })
	], async function(req, res) {
	console.debug("%s: POST /authenticate: called with req.body: %O", __filename, req.body)
	const errors = validationResult(req) 
	if (!errors.isEmpty()) {
		SendResponse.response(res, [ null, {
				status: 'failed',
				message: 'Invalid arguments',
				code: 422
			}
		])
	} else {
		SendResponse.response(res, await UserService.authenticateUser(req.body))
	}
})
		
r.post("/token", async function(req, res) {
	console.debug("%s: POST /token: called with req.body: %O", __filename, req.body)
	SendResponse.response(res, await AuthService.refreshToken(req.body))
})

module.exports = r
