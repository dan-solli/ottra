const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const EquipmentService = require('./../services/equipment.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.get("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await EquipmentService.getEquipment(req.tokenData.uuid))
	}
)

r.post("/", [
	// Need others, there are actions and configuration/variables etc
		check('name').isString().isLength({ min: 3 }),
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
			sendResponse(res, await EquipmentService.createEquipment(req.body, req.tokenData.uuid))
		}
	}
)

module.exports = r

// Controller accepts the connection and:
// -- Check valid parameters
// -- Extracts and bundles information into some sort of internal Data Object -- OR!?
// -- Calls ONE service expecting a result.

// -- The return-value an aSureThing and sendResponse will handle that object, and reply, appropriately
