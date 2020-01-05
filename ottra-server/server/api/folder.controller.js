const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const FolderService = require('./../services/folder.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.post("/", [
	// TODO: 
		autenUser('uuid').isUUID(),
		check('cwd').isString().isLength({ min: 1 }),
		check('folderName').isString().isLength({ min: 1 })
	], async function(req, res) {
		sendResponse(res, await FolderService.createFolder(req.tokenData.uuid, req.body))
	}
)

r.get("/", [ autenUser('uuid').isUUID() ], 
	async function(req, res) {
		sendResponse(res, await FolderService.getFolderTree(req.tokenData.uuid))	
	}
)

r.patch("/", [ autenUser('uuid').isUUID() ], 
	async function(req, res) {
		sendResponse(res, await FolderService.moveFolder(req.tokenData.uuid, req.body))
	}
)

r.delete("/", [ autenUser('uuid').isUUID() ], 
	async function(req, res) {
		console.debug("%s: DELETE / called with body: %O", req.body)
		sendResponse(res, await FolderService.deleteFolder(req.tokenData.uuid, req.body.data))
	}
)

module.exports = r