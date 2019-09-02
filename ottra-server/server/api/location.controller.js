const express = require('express')

const { body, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const LocationService = require('./../services/location.service')
const { sendResponse } = require('./../infra/response.js')


const r = express.Router()

r.get("/", [ autenUser('uuid').isUUID() ], 
	async function(req, res) {
		sendResponse(res, await LocationService.getLocations(req.tokenData.uuid))
	}
)

r.post("/", [
		body('place_id').isString().isLength({ min: 10 }),
		body('name').isString().isLength({ min: 1 }),
		body('street').isString().isLength({ min: 3 }),
		body('city').isString().isLength({ min: 1 }),
		body('country').isString().isLength({ min: 2 }),
		body('postal_code').isPostalCode('any'),
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
			sendResponse(res, await LocationService.createLocation(req.body, req.tokenData.uuid))
		}
	}
)

module.exports = r

// Controller accepts the connection and:
// -- Check valid parameters
// -- Extracts and bundles information into some sort of internal Data Object -- OR!?
// -- Calls ONE service expecting a result.

// -- The return-value an aSureThing and sendResponse will handle that object, and reply, appropriately
