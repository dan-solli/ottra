const express = require('express')

const MessageService = require('./../services/message.service')

const { sendResponse } = require('./../infra/response.js')

const r = express.Router();

r.get('/', async function(req, res) {
	sendResponse(res, await MessageService.getMessages(req.tokenData.uuid))
})

module.exports = r