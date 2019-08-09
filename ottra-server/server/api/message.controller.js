const express = require('express')

const MessageService = require('./../services/message.service')

const SendResponse = require('./../infra/response.js')

const r = express.Router();

r.get('/', async function(req, res) {
	console.debug("%s: GET /: called", __filename)	
	SendResponse.response(res, await MessageService.getMessages(req.tokenData.id))
})

module.exports = r