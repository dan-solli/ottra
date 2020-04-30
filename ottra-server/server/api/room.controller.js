const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const RoomService = require('./../services/room.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.get("/location/:location_id", [ autenUser('uuid').isUUID() ], 
	async function(req, res) {
		sendResponse(res, await RoomService.getRoomsByLocation(req.params.location_id, req.tokenData.uuid))
	}
)

r.get("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await RoomService.getRooms(req.tokenData.uuid))
	}
)

r.get("/:room_id", [ 
		autenUser('uuid').isUUID(),
		check('room_id').isUUID() 
	],
	async function(req, res) {
		sendResponse(res, await RoomService.getRoomById(req.tokenData.uuid, req.params.room_id))
	}
)

r.post("/", [
		check('name').isString().isLength({ min: 3 }),
		check('location').isUUID(),
		autenUser('uuid').isUUID()
	], 
	async function(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty) {
			sendResponse(res, { 
				ok: false, 
				error: { 
					status: 'failed', 
					message: 'Invalid arguments',	
					code: 422 
				}
			})
		}
		else {
			sendResponse(res, await RoomService.createRoom(req.body, req.tokenData.uuid))
		}
	}
)

module.exports = r

// Controller accepts the connection and:
// -- Check valid parameters
// -- Extracts and bundles information into some sort of internal Data Object -- OR!?
// -- Calls ONE service expecting a result.

// -- The return-value an aSureThing and sendResponse will handle that object, and reply, appropriately
