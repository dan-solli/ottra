const express = require('express')
const { check, validationResult } = require('express-validator');

const AuthService = require('./../services/auth.service')
const UserService = require('./../services/user.service')

const { sendResponse } = require('./../infra/response')

const r = express.Router();

r.post('/', [
		check('username').isEmail(),
		check('password').isLength({ min: 10 })
	], async function(req, res) {

	const errors = validationResult(req) 
	if (!errors.isEmpty()) {
		sendResponse(res, { 
			ok: false, 
			error: { 
				status: 'failed', 
				message: 'Invalid arguments',	
				code: 422 
			}
		})
	} else {
		sendResponse(res, await UserService.createUser(req.body))
	}
})

r.post("/authenticate", [
		check('username').isEmail(),
		check('password').isLength({ min: 10 })
	], async function(req, res) {

	const errors = validationResult(req) 
	if (!errors.isEmpty()) {
		sendResponse(res, { 
			ok: false, 
			error: { 
				status: 'failed', 
				message: 'Invalid arguments',	
				code: 422 
			}
		})
	} else {
		sendResponse(res, await UserService.authenticateUser(req.body))
	}
})
		
r.post("/token", async function(req, res) {
	sendResponse(res, await AuthService.refreshToken(req.body))
})

module.exports = r
