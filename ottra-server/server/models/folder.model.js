const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const DocumentModel = {
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
	},
	moveFiles: async function(user_id, payload) {

	},
	deleteFiles: async function(user_id, payload) {

	},
	getFolderTree: async function(user_id) {

	},	
}

module.exports = DocumentModel