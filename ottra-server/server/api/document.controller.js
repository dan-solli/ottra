const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const DocumentService = require('./../services/document.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.post("/", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		if (req.files.documents.constructor !== Array) {
			req.files.documents = [ req.files.documents ]
		}
		sendResponse(res, await DocumentService.uploadDocuments(req.tokenData.uuid, req.files.documents))
	}
)

r.delete("/", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		sendResponse(res, await DocumentService.deleteDocument(req.tokenData.uuid, req.body))
	}
)

r.patch("/", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		sendResponse(res, await DocumentService.moveDocument(req.tokenData.uuid, req.body))
	}
)

r.get("/", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {

/*
		if (path !== undefined) {
			const pathDecoded = decodeURIComponent(path)
			sendResponse(res, await DocumentService.getDocuments(req.tokenData.uuid, pathDecoded))
*/			
		sendResponse(res, await DocumentService.getAllDocuments(req.tokenData.uuid))
	}
)

r.get("/:doc_id", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		sendResponse(res, await Documentservice.getDocumentByID(req.tokenData.uuid, req.param.doc_id))
	}
)

r.post("/association", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		sendResponse(res, await DocumentService.createAssociation(req.tokenData.uuid, req.body))
	}
)

r.delete("/association", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		sendResponse(res, await DocumentService.removeAssociation(req.tokenData.uuid, req.body))
	}
)

r.patch("/association", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		sendResponse(res, await DocumentService.changeDocumentAssociation(req.tokenData.uuid, req.body))
	}
)

r.get("/association", [
		autenUser('uuid').isUUID() 
	], async function(req, res) {
		const source = req.query.source
		const target = req.query.target

		if (source !== undefined) {
			sendResponse(res, await DocumentService.getAssociationsTo(req.tokenData.uuid, source))
		} else if (target !== undefined) {
			sendResponse(res, await DocumentService.getAssociationsFrom(req.tokenData.uuid, target))
		}
	}
)





module.exports = r