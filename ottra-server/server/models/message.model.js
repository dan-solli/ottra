const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const MessageModel = {
	saveMessage: async function(payload) {
		console.debug("%s: saveMessage is called with payload: %O", __filename, payload)
		const { sender = false, recipient = false, subject = 'No subject', 
						body = 'Empty message', timeToLive = -1, type = 'system#undefined' 
		} = payload

		if (!sender || !recipient)
			return false

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
		console.debug("%s: getMessages called with uuid = %s", __filename, uuid)

		const result = await DB.fetchAll(`
	MATCH (:User { uuid: { uuid }})-[:HAS]->(m:Message)
	RETURN COLLECT (m { .*, dateTime: apoc.date.format(m.sent) }) AS Messages`,
		{ uuid: uuid }, "Messages")

		//console.debug("%s: getMessages returns: %O", __filename, result)
		return result
	}
}

module.exports = MessageModel