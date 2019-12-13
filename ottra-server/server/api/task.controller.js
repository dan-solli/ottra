const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const TaskService = require('./../services/task.service')

const { sendResponse } = require('./../infra/response.js')

const r = express.Router();

r.get('/', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await TaskService.getTasks(req.tokenData.uuid))
	}
)

r.post('/', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await TaskService.createTask(req.tokenData.uuid, req.body))
	}
)

r.delete("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await TaskService.deleteTask(req.tokenData.uuid, req.body.uuid))
	}
)

r.put("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		const result = await TaskService.updateTask(req.tokenData.uuid, req.body)
		console.debug("%s: put / returning: %O", __filename, result)
		sendResponse(res, result)
	}
)

module.exports = r