const MessageModel = require('./../models/message.model')

const MessageService = {
	getMessages: async function(user_id) {
		console.debug("%s: getMessages is called with payload: %O", __filename, user_id)

		if (!user_id) {
			return [ null, {
				status: 'failed',
				message: 'Missing user id',
				code: 404
			} ]
		}	else {
			// TODO: Need to enhance this one.
			return [ await MessageModel.getMessages(user_id), null ]
		}
	}
}

module.exports = MessageService