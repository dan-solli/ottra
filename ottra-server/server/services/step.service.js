const StepModel = require('./../models/step.model')

const StepService = {
	createStep: async function(user_id, payload) {
		return await StepModel.createStep(user_id, payload.parent_uuid, payload)
	},
}

module.exports = StepService