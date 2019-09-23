const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const StorageService = require('./../services/storage.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.get("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await StorageService.getStorages(req.tokenData.uuid))
	}
)

r.get("/:storage_id", [ 
		autenUser('uuid').isUUID(),
		check('storage_id').isUUID() 
	], async function(req, res) {
		sendResponse(res, await StorageService.getStorageById(req.tokenData.uuid, req.param.storage_id))
	}
)

r.post("/", [
		check('name').isString().isLength({ min: 3 }),
		check('container').isUUID(),
		autenUser('uuid').isUUID()
	], 
	async function(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty) {
			console.error("%s: POST / validation error: %O", errors)
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
			sendResponse(res, await StorageService.createStorage(req.body, req.tokenData.uuid))
		}
	}
)

module.exports = r

// Controller accepts the connection and:
// -- Check valid parameters
// -- Extracts and bundles information into some sort of internal Data Object -- OR!?
// -- Calls ONE service expecting a result.

// -- The return-value an aSureThing and sendResponse will handle that object, and reply, appropriately
