
const { aSureThing } = require('./../infra/await-to')
const DocumentModel = require('./../models/document.model')

const moveFile = require('move-file')
const fs = require('fs')

process.on("attachDocument", async function attach(to_uuid, file) {

	// This event should call a non-exported function in this service module and let it handle the 
	// actual file-processing and condence the file-maps parameters to what is necessary. 

	return await aSureThing(DocumentModel.attach(to_uuid, file))
})

const DocumentService = {
	getDocuments: async function(user_id) {
		try {
			return await DocumentModel.getDocuments(user_id)
		}
		catch(err) {
			return { ok: false, error: { code: 404, status: 'failed', message: err } }
		}
	},
/*	
	getDocumentById: async function(user_id, doc_id) {

	},
	getDocumentsRelatedToId(user_id, doc_id) {

	},
	relateDocumentToTarget(user_id, doc_id, target_id) {

	},
*/	
	uploadDocuments: async function(user_id, documents) {
		try {
			const returnData = []

			console.debug("%s: Documents: %O", __filename, documents)
			for (const { file, filename, mimetype } of documents) {

				//console.debug("%s: File and filename are:\n%s\n%s", __filename, file, filename)

				const filenameExtension = filename.split('.').pop()
				const fileData = await DocumentModel.createDocument(user_id, filename, filenameExtension, mimetype)

				//console.debug("%s: Filedata is: %O", __filename, fileData)

				if (!fileData.ok) {
					return { ok: false, error: fileData.error }
				} else {
					const { ok } = await aSureThing(moveFile(file, process.env.OTTRA_CONTENT_PATH + "/" + user_id + "/" + fileData.data.filename))
					if (ok) {
						returnData.push(fileData)
					} else {
						returnData.push({ ok: false, error: { code: 500, status: 'failed', message: 'File failed to upload' } })
					}
				}
			}
			return { ok: true, data: returnData }
		}
		catch (err) {
			console.error("%s: Error is: %O", __filename, err)
			return { ok: false, error: { code: 500, status: 'failed', message: 'Could not upload file' } }
		}
	},
	createFolder: async function(user_id, payload) {
		console.debug("%s: createFolder called with payload: %O", __filename, payload)
		const { cwd, folderName } = payload
		const path = process.env.OTTRA_CONTENT_PATH + "/" + user_id + "/" + cwd + "/" + folderName
		console.debug("%s: createFolder built pathname: %s", __filename, path)
		fs.mkdir(path, { recursive: false }, (err) => {
				return { ok: false, error: { code: 500, status: 'failed', message: err } }
			}
		)
		return { ok: true, data: path }
	},
	moveFile: async function(user_id, payload) {
		return await DocumentModel.moveFile(user_id, payload)
	},
	deleteFile: async function(user_id, payload) {
		return await DocumentModel.deleteFile(user_id, payload)
	},
	getFolderTree: async function(user_id) {
		return await DocumentModel.getFolderTree(user_id)
	},
}

module.exports = DocumentService
