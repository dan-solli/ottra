const express = require('express')
const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');
const checkTokenData = buildCheckFunction([ 'tokenData' ])


const GroupService = require('./../services/group.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

/*
r.get("/", async function(req, res) {
	console.debug("%s: GET /: called", __filename)
	SendResponse.response(res, await GroupService.getGroups(req.tokenData.uuid))	
})
*/

r.post("/", [
		check('groupName').isString().isLength({ min: 3 }),
		checkTokenData('uuid').isUUID()
	], async function(req, res) {
	const errors = validationResult(req) 

	if (!errors.isEmpty()) {
		sendResponse(res, { ok: false, 
			error: {
				status: 'failed',
				message: 'Invalid arguments',
				code: 422
			}
		})
	} else {
		sendResponse(res, await GroupService.createGroup(req.body, req.tokenData.uuid))
	}
})

r.post("/invite", async function(req, res) {
	sendResponse(res, await GroupService.inviteUsers(req.body, req.tokenData.uuid))
})


module.exports = r
