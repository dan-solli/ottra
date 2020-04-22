const DB = require('./../infra/db')

const uuidv4 = require('uuid/v4')

const dirTree = require('directory-tree')
const traverse = require('traverse')
const thePath = require('path')

const DocumentModel = {
	getAllDocuments: async function(user_id) {
		const startPath = process.env.OTTRA_CONTENT_PATH + "/" + user_id
		const theTree = dirTree(startPath, { attributes: ['mtime', 'ctime'] })

		var obFromDb = {}
		var resultData = {}

		const dbResult = await this.getDocuments(user_id)
		if (dbResult.ok) {
			dbResult.data.forEach(function (f) {
				obFromDb[f.filename] = f
			})
		}

		handleChild(theTree)
		//console.debug("%s: getAllDocuments yields: %O", __filename, resultData)
		return { ok: true, data: resultData }

		function rewriteChild(child) {
			child.path = child.path.replace(startPath, "")
			child.path = thePath.dirname(child.path)
			if (child.path === ".") {
				child.path = "/"
			}
			if (obFromDb.hasOwnProperty(child.name)) {
				child = Object.assign(child, obFromDb[child.name])
			}
			return child
		}

		function handleChild(child) {
			child = rewriteChild(child)

			if (child.hasOwnProperty('children')) {
				if (child.children.length > 0) {
					child.children.forEach(function(c) {
						handleChild(c)
					})
				} else {
					const cPath = child.path + "/" + child.name
					//console.debug("%s: Empty directory for %s, creating such...", __filename, cPath) 
					resultData[cPath] = []
				}
			}
			if (!resultData.hasOwnProperty(child.path)) {
				resultData[child.path] = []
			}
			delete child.children
			resultData[child.path].push(child)
		}
	},	
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
	deleteDocument: async function(user_id, doc_uuid) {
		return await DB.fetchRow(`
			MATCH (n:Document { uuid: { doc_uuid }}) 
			WITH n, properties(n) as props
			DETACH DELETE n 
			RETURN props AS Props`, { doc_uuid: doc_uuid }, "Props")
	},
	getFolderTree: async function(user_id) {

	},
	createAssociation: async function(user_id, payload) {
		const { attachment, target, type } = payload
		console.debug("%s: createAssociation: %O", __filename, payload)

		const uuid = uuidv4()

		return await DB.fetchRow(`
			MATCH (u:User { uuid: { user_id } })-[*0..100]->(t { uuid: { target } }),
						(u)-[*0..100]->(a { uuid: { attachment } })
			CREATE (a)-[r:ATTACHMENT { type: { type } }]->(t)
			RETURN r AS Relation
		`, {
			user_id, target, attachment, type
		}, "Relation")
	}
}

module.exports = DocumentModel