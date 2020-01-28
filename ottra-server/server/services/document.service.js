
const { aSureThing } = require('./../infra/await-to')
const DocumentModel = require('./../models/document.model')

const moveFile = require('move-file')
const fs = require('fs')
const fsPath = require('path')

const dirTree = require("directory-tree")

const DocumentService = {
	getDocumentByID: async function(user_id, doc_id) {

	},
	getAllDocuments: async function(user_id) {
		try {
			return await DocumentModel.getAllDocuments(user_id)
		}
		catch(err) {
			return { ok: false, error: { code: 404, status: 'failed', message: err } }
		}
	},
	uploadDocuments: async function(user_id, cwd, documents) {
		try {
			const returnData = []

			console.debug("%s: Documents: %O", __filename, documents)
			for (const { file, filename, mimetype } of documents) {

				console.debug("%s: File and filename are:\n%s\n%s", __filename, file, filename)

				const filenameExtension = filename.split('.').pop()
				const fileData = await DocumentModel.createDocument(user_id, filename, filenameExtension, mimetype)

				console.debug("%s: Filedata is: %O", __filename, fileData)

				if (!fileData.ok) {
					return { ok: false, error: fileData.error }
				} else {
					const { ok } = await aSureThing(moveFile(file, process.env.OTTRA_CONTENT_PATH + "/" + user_id + cwd + "/" + fileData.data.filename))
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
	moveFile: async function(user_id, payload) {
		return await DocumentModel.moveFile(user_id, payload)
	},
	deleteDocument: async function(user_id, payload) {
		console.debug("%s: deleteDocument called with payload: %O", __filename, payload)
		const { path: doc_path, file: doc_filename, uuid: doc_uuid } = payload
		console.debug("%s: deleteDocument calling DM.deleteDocument with uuid %s", __filename, doc_uuid)
		const result = await DocumentModel.deleteDocument(user_id, doc_uuid)
		console.debug("%s: deleteDocument: DM.deleteDocument returned %O", __filename, result)
		if (result.ok) {
			const path = process.env.OTTRA_CONTENT_PATH + "/" + user_id + "/" + doc_path
			const fullFilename = path + "/" + doc_filename
			console.debug("%s: Trying to delete %s", __filename, fullFilename)
			try {
				fs.unlinkSync(fullFilename)
				console.debug("%s: deleteDocument: Unlink worked, returning %O", __filename, result)
				return result
			}
			catch (err) {
				console.error("%s: Failed to unlink %s: Error: %s", __filename, fullFilename, err)
				return { ok: false, error: { code: 500, status: "failed", message: "Could not delete file " + fullFilename }}
			}
		}
		else {
			console.error("%s: deleteDocument: call to Model failed. Returning: %O", __filename, result)
			return result
		}
	},
}

module.exports = DocumentService
