const express = require('express')
const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const UserService = require('./../services/user.service')

const { sendResponse } = require('./../infra/response')

const r = express.Router();

r.get('/', [
		autenUser('uuid').isUUID()
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
		const result = await UserService.getUser(req.tokenData.uuid)
		if (result.ok) {
			delete result.data.password
		}
		sendResponse(res, result)
	}
})

module.exports = r
