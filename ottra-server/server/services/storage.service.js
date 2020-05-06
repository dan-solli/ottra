const StorageModel = require('./../models/storage.model')
const LocationModel = require('./../models/location.model')

const StorageService = {
	createStorage: async function(payload, user_id) {
		try {
			if (payload.mobile) {
				payload.current_container = payload.container
			}
			const accessEquipment = payload.accessEquipment
			delete payload.accessEquipment

			const createStorageResult = await StorageModel.createStorage(payload, user_id)

			accessEquipment.forEach(async function (eq_uuid) {
				await LocationModel.createAccessKey(createStorageResult.data.uuid, eq_uuid)
			})

			return await StorageModel.getStorageById(user_id, createStorageResult.data.uuid)
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	},
	getStorages: async function(user_id) {
		const storages = await StorageModel.getStorages(user_id)
		//console.debug("%s: Returning storages: %O", __filename, storages)
		return storages
	},
	getStorageById: async function(user_id, storage_id) {
		return await StorageModel.getStorageById(user_id, storage_id)
	}
}

module.exports = StorageService
