const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const DocumentModel = {
/*	
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
*/
	getDocuments: async function(user_id) {
		return await DB.fetchAll(`
			MATCH (u:User { uuid: { user_id } })-[:UPLOADED]->(n:Document)
			RETURN COLLECT (n { .*, dateTime: apoc.date.format(n.uploaded) }) 
			AS Documents`, {
				user_id: user_id
			}, "Documents"
		)
	},
	createDocument: async function(user_id, filename, extension, mimetype)	{

		console.debug("%s: Filename: %s\tExtension: %s", __filename, filename, extension)

		const uuid = uuidv4()
		const new_filename = uuid + "." + extension

		return await DB.fetchRow(`
			MATCH (u:User { uuid: { user_id } }) 
			CREATE (u)-[:UPLOADED]->(n:Document {
				uuid: {new_uuid},
				filename: {new_filename},
				original_filename: {filename},
				uploader: {user_id},
				mimetype: {mimetype},
				uploaded: TIMESTAMP()
			}) RETURN n { .* } AS Document`, {
				new_uuid: uuid,
				filename: filename,
				new_filename: new_filename,
				user_id: user_id,
				mimetype: mimetype
			}, 
			"Document"
		)
	}
}

module.exports = DocumentModel