let express = require('express')

const MessageService = require('./../services/message.service')

module.exports = function() 
{
	const r = express.Router();

	// Create new user

	r.get('/', function(req, res) {
		res.send(MessageService.getMessages(req.body))
	})

	return r;
}
