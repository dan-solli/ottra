const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const StepService = require('./../services/step.service')

const { sendResponse } = require('./../infra/response.js')

const r = express.Router();

r.get('/', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await StepService.getSteps(req.tokenData.uuid))
	}
)

r.get('/:step_id', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await StepService.getStepById(req.tokenData.uuid, req.params.step_id))
	}
)

r.post('/', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await StepService.createStep(req.tokenData.uuid, req.body))
	}
)

r.delete("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		console.debug("%s: DELETE step: Req.body is: %O", __filename, req.body)
		sendResponse(res, await StepService.deleteStep(req.tokenData.uuid, req.body.uuid))
	}
)

r.put("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await StepService.updateStep(req.tokenData.uuid, req.body))
	}
)

r.put('/:step_id/vai', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, 
			await StepService.saveVisualAidImages(req.tokenData.uuid, 
				req.params.step_id, req.body.vai))
	}
)

r.put('/:step_id/tools', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, 
			await StepService.saveTools(req.tokenData.uuid, 
				req.params.step_id, req.body.tools))
	}
)

r.put('/:step_id/attachments', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, 
			await StepService.saveAttachments(req.tokenData.uuid, 
				req.params.step_id, req.body.attachments))
	}
)


module.exports = r