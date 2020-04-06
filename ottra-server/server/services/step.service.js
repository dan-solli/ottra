const StepModel = require('./../models/step.model')
const CommonService = require('./common.service')

const STEP_UNDEFINED = 0
const STEP_INSTRUCTION = 1
const STEP_PAUSE = 2
const STEP_TRANSPORT = 3
const STEP_TASK = 4

const StepService = {
	createStep: async function(user_id, payload) {
		console.debug("%s: createStep payload: %O", __filename, payload)
		const relations = await StepService.getRelations(payload)

		console.debug("%s: createStep relations: %O", __filename, relations)

		await Object.keys(relations).forEach(async function(key) {
			await delete payload[key]
		})
		console.debug("%s: createStep filtered payload: %O", __filename, payload)

		const result = await StepModel.createStep(user_id, payload)
		await StepService.resolveStepRelations(payload.uuid, relations)
		if (result.ok) {
			return await StepModel.getStepById(result.data.uuid)
		} else {
			return result
		}
	},
	getSteps: async function(user_id) {
		return await StepModel.getSteps(user_id)
	},
	deleteStep: async function(user_id, step_id) {
		return await StepModel.deleteStep(user_id, step_id)
	},
	updateStep: async function(user_id, payload) {
		console.debug("%s: updateStep payload: %O", __filename, payload)
		const relations = await StepService.getRelations(payload)

		console.debug("%s: updateStep relations: %O", __filename, relations)

		await Object.keys(relations).forEach(async function(key) {
			await delete payload[key]
		})
		console.debug("%s: updateStep filtered payload: %O", __filename, payload)

		const result = await StepModel.updateStep(user_id, payload)
		await StepService.resolveStepRelations(payload.uuid, relations)
		if (result.ok) {
			return await StepModel.getStepById(result.data.uuid)
		} else {
			return result
		}
	},
	getRelations: function(payload) {
		var relations = {}
		const indices = [
			"tools", 
			"visualAidImages",
			"attachments",
			"task",
			"destination",
			"stepLocation"
		]

		indices.forEach(function (key) {
			console.debug("%s: getRelations, looking for key: %s", __filename, key)
			if (payload.hasOwnProperty(key)) {
				console.debug("%s: getRelations, key %s seem to exist", __filename, key)
				console.debug("%s: getRelations, extracting payload.key to: %O", __filename, payload[key])
				relations = Object.assign(relations, { [key]: payload[key] })
				console.debug("%s: getRelations, relations is now: %O", __filename, relations)
			}
		})
		console.debug("%s: getRelations, returning %O", __filename, relations)
		return relations
	},
	resolveStepRelations: async function(src, payload) {
		console.debug("%s: resolveStepRelations IN payload: %O", __filename, payload)
		try {
			if (payload.hasOwnProperty('tools') && payload.tools.length > 0) {
				payload.tools.forEach(async function (tool_uuid) {
					await CommonService.createRelation(src, tool_uuid, "REQUIRES", {})
				})
			}
			if (payload.hasOwnProperty('visualAidImages') && 
							payload.visualAidImages.length > 0) {
				payload.visualAidImages.forEach(async function (img_uuid) {
					await CommonService.createRelation(src, img_uuid, "VISUALAID", {})
				})
			}
			if (payload.hasOwnProperty('attachments') && payload.attachments.length > 0) {
				payload.attachments.forEach(async function (attachment_uuid) {
					await CommonService.createRelation(src, attachment_uuid, "ATTACHMENT", {})
				})
			}
			if (payload.hasOwnProperty('task') && payload.task.length > 0) {
				await CommonService.createRelation(src, payload.task, "INCLUDES", {})
			}
			if (payload.hasOwnProperty('destination') && payload.destination.length > 0) {
				await CommonService.createRelation(src, payload.destination, "AT", {})
			}
			if (payload.hasOwnProperty('stepLocation') && payload.stepLocation.length > 0) {
				await CommonService.createRelation(src, payload.stepLocation, "IN", {})
			}
		}
		catch (err) {
			console.error("%s: resolveStepRelations failed: %O", __filename, err)
		}
		console.debug("%s: resolveStepRelations OUT payload: %O", __filename, payload)
		return payload
	},
}

module.exports = StepService