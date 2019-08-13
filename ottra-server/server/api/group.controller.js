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
	SendResponse.response(res, await GroupService.getGroups(req.tokenData.id))	
})

r.post("/", [
		check('groupName').isString().isLength({ min: 3 }),
		checkTokenData('id').isUUID()
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
	}
	SendResponse.response(res, await GroupService.createGroup(req.body, req.tokenData.id))
})

r.post("/invite", async function(req, res) {
	console.debug("%s: POST /invite: called with req.body: %O", __filename, req.body)
	SendResponse.response(res, await GroupService.inviteUsers(req.body, req.tokenData.id))
})

module.exports = r
