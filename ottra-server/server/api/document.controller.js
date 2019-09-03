const express = require('express')

const DocumentService = require('./../services/document.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.get("/", async function(req, res) {
	sendResponse(res, await DocumentService.getDocuments(req.tokenData.uuid))	
})

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

r.get("/relate/:document_uuid/to/:target_uuid", async function(req, res) {
	// TODO: Add parameter checking
	const { doc_uuid, target_uuid }	= req.params

	sendResponse(res, await DocumentService.relateDocumentToTarget(req.tokenData.uuid, doc_uuid, target_uuid))
})

r.post("/", async function(req, res) {
	// TODO: Add parameter checking
	console.debug("%s: Req.files are: %O", __filename, req.files)
	if (req.files.documents.constructor !== Array) {
		req.files.documents = [ req.files.documents ]
	}
	sendResponse(res, await DocumentService.uploadDocuments(req.tokenData.uuid, req.files.documents))
})

module.exports = r