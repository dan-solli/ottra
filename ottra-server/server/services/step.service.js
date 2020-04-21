const StepModel = require('./../models/step.model')
//const CommonService = require('./common.service')

const STEP_UNDEFINED = 0
const STEP_INSTRUCTION = 1
const STEP_PAUSE = 2
const STEP_TRANSPORT = 3
const STEP_TASK = 4

const StepService = {
	createStep: async function(user_id, payload) {
		console.debug("%s: createStep payload: %O", __filename, payload)

		const result = await StepModel.createStep(user_id, payload)
		console.debug("%s: createStep in Model returns: %O", __filename, result)
		if (result.ok) {
			console.debug("%s: Calling StepService.getStepById with user: %s and step: %s",
				__filename, user_id, result.data.uuid)
			return await StepService.getStepById(user_id, result.data.uuid)
		} else {
			return result
		}
	},
	getStepById: async function(user_id, step_uuid) {
		// This one has to consolidate several different queries against the DB.
		// It'll be interesting to see how much more expensive it will be than weird cypher.
		const stepData = await StepModel.getStepById(user_id, step_uuid);
		console.debug("%s: getStepById got stepData: %O", __filename, stepData)
		if (stepData.ok) {
			const vai = await StepModel.getVisualAidImages(step_uuid)
			console.debug("%s: vai = %O", __filename, vai)
			if (vai.ok) {
				stepData.data.visualAidImages = vai.data.slice()
			}
			if (stepData.data.stepType === STEP_INSTRUCTION || 
				  stepData.data.stepType === STEP_TRANSPORT) {
				const attachments = await StepModel.getAttachments(step_uuid)
				console.debug("%s: attachments = %O", __filename, attachments)
				if (attachments.ok) {
					stepData.data.attachments = attachments.data.slice()
				}
			}
			if (stepData.data.stepType === STEP_INSTRUCTION) {
				const tools = await StepModel.getTools(step_uuid)
				if (tools.ok) {
					console.debug("%s: tools = %O", __filename, tools)
					stepData.data.tools = tools.data.slice()
				}
			}
		}
		console.debug("%s: getStepById returning: %O", __filename, stepData)
		return stepData
	},
	getSteps: async function(user_id) {
		console.error("%s: getSteps is deprecated for now.", __filename)
		return await StepModel.getSteps(user_id)
	},
	deleteStep: async function(user_id, step_id) {
		console.debug("%s: deleteStep called with %s", __filename, step_id)
		return await StepModel.deleteStep(user_id, step_id)
	},
	updateStep: async function(user_id, payload) {
		console.debug("%s: updateStep payload: %O", __filename, payload)

		const result = await StepModel.updateStep(user_id, payload)
		if (result.ok) {
			return StepService.getStepById(user_id, result.data.uuid)
		} else {
			return result
		}
	},
}

module.exports = StepService