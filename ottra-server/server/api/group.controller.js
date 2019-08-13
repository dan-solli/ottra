const express = require('express')
const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');
const checkTokenData = buildCheckFunction([ 'tokenData' ])


const GroupService = require('./../services/group.service')
const SendResponse = require('./../infra/response.js')

const r = express.Router()

r.get("/", async function(req, res) {
	console.debug("%s: GET /: called", __filename)
	SendResponse.response(res, await GroupService.getGroups(req.tokenData.uuid))	
})

r.post("/", [
		check('groupName').isString().isLength({ min: 3 }),
		checkTokenData('uuid').isUUID()
	], async function(req, res) {
	console.debug("%s: POST /: called with req.body: %O", __filename, req.body)
	const errors = validationResult(req) 

	console.error("%s: POST / errors: %O", __filename, errors)

	if (!errors.isEmpty()) {
		SendResponse.response(res, [ null, {
				status: 'failed',
				message: 'Invalid arguments',
				code: 422
			}
		])
	} else {
		SendResponse.response(res, await GroupService.createGroup(req.body, req.tokenData.uuid))
	}
})

r.post("/invite", async function(req, res) {
	console.debug("%s: POST /invite: called with req.body: %O", __filename, req.body)
	SendResponse.response(res, await GroupService.inviteUsers(req.body, req.tokenData.uuid))
})

module.exports = r
