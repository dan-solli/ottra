const StepModel = require('./../models/step.model')

const StepService = {
	createStep: async function(user_id, payload) {
		return await StepModel.createStep(user_id, payload.parent_uuid, payload)
	},
	getSteps: async function(user_id) {
		return await StepModel.getSteps(user_id)
	},
	deleteStep: async function(user_id, step_id) {
		return await StepModel.deleteStep(user_id, step_id)
	}
}

module.exports = StepService