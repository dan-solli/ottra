const EquipmentModel = require('./../models/equipment.model')

const EquipmentService = {
	createEquipment: async function(payload, user_id) {
		try {
			result = await EquipmentModel.createEquipment(payload, user_id)
			console.debug("%s: createEquipment returning: %O", __filename, result)
			return result
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	},
	getEquipment: async function(user_id) {
		return await EquipmentModel.getEquipment(user_id)
	}
}

module.exports = EquipmentService
