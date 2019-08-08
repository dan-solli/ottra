const MessageModel = require('./../models/message.model')

const MessageService = {
	getMessages: async function(payload) {
		console.debug("%s: getMessages is called with payload: %O", __filename, payload)

		const uuid = payload.tokenData.id
		if (!uuid) {
			return {
				status: 'failed',
				message: 'Missing accessToken',
				code: 404
			}
		}	else {
			return await MessageModel.getMessages(uuid)
		}
	}
}

module.exports = MessageService