const StorageModel = require('./../models/storage.model')

const StorageService = {
	createStorage: async function(payload, user_id) {
		try {
			createStorageResult = await StorageModel.createStorage(payload, user_id)
			console.debug("%s: createStorage returning: %O", __filename, createStorageResult)
			return createStorageResult
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	},
	getStorages: async function(user_id) {
		return await StorageModel.getStorages(user_id)
	}
}

module.exports = StorageService
