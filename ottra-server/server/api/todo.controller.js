const express = require('express')

const { check, 
				validationResult,
				buildCheckFunction 
			} = require('express-validator');

const autenUser = buildCheckFunction([ 'tokenData' ])

const TodoService = require('./../services/todo.service')

const { sendResponse } = require('./../infra/response.js')

const r = express.Router();

r.get('/', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await TodoService.getTodos(req.tokenData.uuid))
	}
)

r.post('/', [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await TodoService.createTodo(req.tokenData.uuid, req.body))
	}
)

r.delete("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		sendResponse(res, await TodoService.deleteTodo(req.tokenData.uuid, req.body.uuid))
	}
)

r.put("/", [ autenUser('uuid').isUUID() ],
	async function(req, res) {
		const result = await TodoService.updateTodo(req.tokenData.uuid, req.body)
		console.debug("%s: put / returning: %O", __filename, result)
		sendResponse(res, result)
	}
)

module.exports = r