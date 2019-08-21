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
		check('loc_place_id').isString().isLength({ min: 10 }),
		check('loc_street').isString().isLength({ min: 3 }),
		check('loc_city').isString().isLength({ min: 1 }),
		check('loc_country').isString().isLength({ min: 2 }),
		check('loc_postal_code').isPostalCode('any'),
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
		SendResponse.response(res, await LocationService.createLocation(req.body, req.tokenData.uuid))
	}
})

module.exports = r
