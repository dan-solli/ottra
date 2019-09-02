const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const MessageModel = {
	saveMessage: async function(payload) {
		const { sender = false, recipient = false, subject = 'No subject', 
						body = 'Empty message', timeToLive = -1, type = 'system#undefined' 
		} = payload

		if (!sender || !recipient)
			return { ok: false, error: { code: 401, status: 'failed', message: 'Missing sender or recipient' }}

		return await DB.fetchRow(`
	MATCH (u:User { uuid: {recipient} })					
	CREATE (u)-[:HAS]->(n:Message { 
						uuid: {new_uuid}, 
						from: {sender}, recipient: {recipient}, subject: {subject}, body: {body},
						timeToLive: {timeToLive}, type: {type}, status: 'unread',	sent: TIMESTAMP()
					}) return n { .* } as Message`, { 
						new_uuid: uuidv4(), 
						sender, 
						recipient, 
						subject, 
						body, 
						timeToLive, 
						type 
					}, "Message"
		)
	},
	getMessages: async function(uuid) {
		return await DB.fetchAll(`
	MATCH (:User { uuid: { uuid }})-[:HAS]->(m:Message)
	RETURN COLLECT (m { .*, dateTime: apoc.date.format(m.sent) }) AS Messages`,
		{ uuid: uuid }, "Messages")
	}
}

module.exports = MessageModel