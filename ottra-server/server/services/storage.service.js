const StorageModel = require('./../models/storage.model')

const StorageService = {
	createStorage: async function(payload, user_id) {
		try {
			if (payload.mobile) {
				payload.current_container = payload.container
			}
			const createStorageResult = await StorageModel.createStorage(payload, user_id)
			return await StorageModel.getStorageById(user_id, createStorageResult.data.uuid)
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	},
	getStorages: async function(user_id) {
		return await StorageModel.getStorages(user_id)
	},
	getStorageById: async function(user_id, storage_id) {
		return await StorageModel.getStorageById(user_id, storage_id)
	}
}

module.exports = StorageService
