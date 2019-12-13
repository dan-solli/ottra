const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const DocumentService = require('./../services/document.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.get("/", async function(req, res) {
	sendResponse(res, await DocumentService.getDocuments(req.tokenData.uuid))	
})

/*
r.get("/:document_uuid", async function(req, res) {
	// TODO: Add parameter checking
	const document_uuid = req.params.document_uuid

	sendResponse(res, await DocumentService.getDocumentById(req.tokenData.uuid, document_uuid))	
})

r.get("/related/to/:uuid", async function(req, res) {
	// TODO: Add parameter checking
	const target_uuid = req.params.uuid

	sendResponse(res, await DocumentService.getDocumentsRelatedToId(req.tokenData.uuid, target_uuid))
})

r.put("/relate/:document_uuid/to/:target_uuid", async function(req, res) {
	// TODO: Add parameter checking
	const { doc_uuid, target_uuid }	= req.params

	sendResponse(res, await DocumentService.relateDocumentToTarget(req.tokenData.uuid, doc_uuid, target_uuid))
})

*/
r.post("/", async function(req, res) {
	// TODO: Add parameter checking
	console.debug("%s: Req.files are: %O", __filename, req.files)
	if (req.files.documents.constructor !== Array) {
		req.files.documents = [ req.files.documents ]
	}
	sendResponse(res, await DocumentService.uploadDocuments(req.tokenData.uuid, req.files.documents))
})

r.post("/folder", [
		// TODO: Should validate that folderName only contains [A-Za-z0-9-_.]
		autenUser('uuid').isUUID()
	],
	async function(req, res) {
		// TODO: Add parameter checking
		console.debug("%s: POST /folder: Payload is: %O", __filename, req.body)
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
			sendResponse(res, await DocumentService.createFolder(req.tokenData.uuid, req.body))
		}
	}
)

r.patch("/folder", async function(req, res) {
	// TODO: Add parameter checking
	console.debug("%s: PATCH /folder: Payload is: %O", __filename, req.body)
	sendResponse(res, await DocumentService.moveFile(req.tokenData.uuid, rec.body))
})

/* Yeah, this one should probably just delete one file at the time */
r.delete("/", async function(req, res) {
	// TODO: Add parameter checking
	console.debug("%s: DELETE /: Payload is: %O", __filename, req.body.data)
	sendResponse(res, await DocumentService.deleteFile(req.tokenData.uuid, rec.body.data))
})

r.get("/folder", async function(req, res) {
	console.debug("%s: GET /folder", __filename)
	sendResponse(res, await DocumentService.getFolderTree(req.tokenData.uuid))
})

module.exports = r