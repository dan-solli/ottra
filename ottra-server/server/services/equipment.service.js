const EquipmentModel = require('./../models/equipment.model')

const EquipmentService = {
	createEquipment: async function(payload, user_id) {
		try {
			const result = await EquipmentModel.createEquipment(payload, user_id)
			return await EquipmentModel.getEquipmentById(user_id, result.data.uuid)
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	},
	getEquipment: async function(user_id) {
		return await EquipmentModel.getEquipment(user_id)
	},
	getEquipmentById: async function(user_id, eq_id) {
		console.debug("%s: getEquipmentById is called with user_id: %s, eq_id: %s", 
			__filename, user_id, eq_id)
		try {
			return await EquipmentModel.getEquipmentById(user_id, eq_id)
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	}
}

module.exports = EquipmentService
