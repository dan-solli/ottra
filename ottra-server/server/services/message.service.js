const MessageModel = require('./../models/message.model')

const MessageService = {
	getMessages: async function(user_id) {
		if (!user_id) {
			return { ok: false, error: { code: 404, status: 'failed', message: 'No such user' }}
		}	else {
			return await MessageModel.getMessages(user_id)
		}
	}
}

module.exports = MessageService