const express = require('express')

const { check, 
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

r.get("/:loc_uuid", [ autenUser('uuid').isUUID() ], 
	async function(req, res) {
		sendResponse(res, await LocationService.getLocation(req.tokenData.uuid, req.params.loc_uuid))
	}
)

r.delete("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		// There really should be some extra safeguard here. Only delete your own rooms etc.
		sendResponse(res, await LocationService.deleteLocation(req.body, req.tokenData.uuid))
	}
)

r.post("/", [
		check('name').isString().isLength({ min: 3 }),
		check('address').isString().isLength({ min: 3 }),
		check('country').isString().isLength({ min: 2 }),
		check('latitude').isDecimal({ force_decimal: false }),
		check('longitude').isDecimal({ force_decimal: false }),
		check('place_id').isString().isLength({ min: 1 }),
		autenUser('uuid').isUUID()
	], 
	async function(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty) {
			sendResponse(res, { 
				ok: false, 
				error: { 
					status: 'failed', 
					message: "This",	
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
