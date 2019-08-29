const express = require('express')
const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');
const checkTokenData = buildCheckFunction([ 'tokenData' ])

const LocationService = require('./../services/location.service')
const SendResponse = require('./../infra/response.js')

const r = express.Router()

r.get("/", async function(req, res) {
	console.debug("%s: GET /: called", __filename)
	SendResponse.response(res, await LocationService.getLocations(req.tokenData.uuid))	
})

r.post("/", [
		check('place_id').isString().isLength({ min: 10 }),
		check('name').isString().isLength({ min: 1 }),
		check('street').isString().isLength({ min: 3 }),
		check('city').isString().isLength({ min: 1 }),
		check('country').isString().isLength({ min: 2 }),
		check('postal_code').isPostalCode('any'),
		checkTokenData('uuid').isUUID()
	], async function(req, res) {
	console.debug("%s: POST /: called with req.body: %O", __filename, req.body)

/*
	console.debug("20 000 kr frågan. Finns det några filer?!?!?!")
	console.debug("%s: FILES ARE: %O", __filename, req.files)
*/

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
		SendResponse.response(res, await LocationService.createLocation(req.body, req.tokenData.uuid))
	}
})

module.exports = r

// Controller accepts the connection and:
// -- Check valid parameters
// -- Extracts and bundles information into some sort of internal Data Object
// -- Calls ONE service expecting a result.

// -- The return-value IS a Promise and
//      if resolved - the response object will be returned with a 2XX status
// 			if rejected - will return a 4XX or 5XX status with some complementary information - as returned by the service.