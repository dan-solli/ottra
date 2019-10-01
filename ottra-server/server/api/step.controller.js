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

r.post('/', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await StepService.createStep(req.tokenData.uuid, req.body))
	}
)

r.delete("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await StepService.deleteStep(req.tokenData.uuid, req.body.uuid))
	}
)

/*
r.put("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await TodoService.updateTodo(req.tokenData.uuid, req.body))
	}
)
*/
module.exports = r