const express = require('express')

const TodoService = require('./../services/todo.service')

const { sendResponse } = require('./../infra/response.js')

const r = express.Router();

r.get('/', async function(req, res) {
	sendResponse(res, await TodoService.getTodos(req.tokenData.uuid))
})

r.post('/', async function(req, res) {
	sendResponse(res, await TodoService.createTodo(req.tokenData.uuid, req.body))
})

module.exports = r