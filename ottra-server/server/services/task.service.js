const TaskModel = require('./../models/task.model')
const StepModel = require('./../models/step.model')
const CommonService = require('./common.service')

const TaskService = {
	getTasks: async function(user_id) {
		if (!user_id) {
			return { ok: false, error: { code: 404, status: 'failed', message: 'No such user' }}
		}	else {
			return await TaskModel.getTasks(user_id)
		}
	},
	getTask: async function(user_id, task_id) {
		if (!user_id || !task_id) {
			return { ok: false, error: { code: 404, status: 'failed', messages: "Missing parameters" }}
		} else {
			return await TaskModel.getTask(user_id, task_id)
		}
	},
	createTask: async function(user_id, payload) {
		try {
/*			
			if (payload.goalImages.length > 0) {
				payload.goalImages.forEach(async function (img) {
					await CommonService.createRelation(payload.uuid, img, "GOALIMAGE", {})
				})
			}
			if (payload.goodEnoughImages.length > 0) {	
				payload.goodEnoughImages.forEach(async function (img) {
					await CommonService.createRelation(payload.uuid, img, "GOODENOUGHIMAGE", {})
				})
			}
			if (payload.steps.length > 0) {
				var orderCnt = 0
				payload.steps.forEach(async function (step) {
					await CommonService.createRelation(payload.uuid, step, "INCLUDE", { order: orderCnt++ })
					orderCnt++
				})
			}
			delete payload.goalImages
			delete payload.goodEnoughImages
			delete payload.steps
*/
			const result = await TaskModel.createTask(user_id, payload)

			// Here, we return the smallest of tasks, without relations at all. 
			return result
		}
		catch (err) {
			return { ok: false, error: err }
		}
	},
	deleteTask: async function(user_id, task_uuid) {
		return await TaskModel.deleteTask(user_id, task_uuid)
	},
	updateTask: async function(user_id, payload) {
		if (payload.hasOwnProperty("goalImages") && payload.goalImages.length > 0) {
			payload.goalImages.forEach(async function (img) {
				await CommonService.createRelation(payload.uuid, img, "GOALIMAGE", {})
			})
		}
		if (payload.hasOwnProperty("goodEnoughImages") && payload.goodEnoughImages.length > 0) {
			payload.goodEnoughImages.forEach(async function (img) {
				await CommonService.createRelation(payload.uuid, img, "GOODENOUGHIMAGE", {})
			})
		}
		if (payload.hasOwnProperty("steps") && payload.steps.length > 0) {
			var orderCnt = 0
			payload.steps.forEach(async function (step) {
				await CommonService.createRelation(payload.uuid, step, "INCLUDE", { order: orderCnt++ })
				orderCnt++
			})
		}
		delete payload.goalImages
		delete payload.goodEnoughImages
		delete payload.steps

		console.debug("%s: updateTask: Calling TaskModel.updateTask", __filename)
		await TaskModel.updateTask(user_id, payload)
		console.debug("%s: updateTask: Calling TaskModel.getTask", __filename)
		var result = await TaskModel.getTask(user_id, payload.uuid)
		console.debug("%s: updateTask: TaskModel.getTask returns %O", __filename, result)
		if (result.ok) {
			const response = await TaskModel.getSteps(user_id, payload.uuid)
			if (response.ok) {
				result.data.steps.push(...response.data)
			} else {
				return response
			}
		}
		console.debug("%s: updateTask will return: %O", __filename, result.data)
		return result
	},
	// In use
	getTaskSteps: async function(user_id, task_uuid) {
		const stepData = await TaskModel.getSteps(user_id, task_uuid)
		if (stepData.ok) {
			const steps = await Promise.all(stepData.data.map(async function(step) {
				console.debug("%s: getTaskSteps, in loop. Var is: %O", __filename, step)
				const response = await StepService.getStepById(user_id, step)
				if (response.ok) {
					return response.data
				}
			}))
			console.debug("%s: getTaskSteps returns: %O", __filename, steps)
			return { ok: true, data: steps }
		}
		else {
			return { ok: false, error: { code: 422, status: 'failure', message: "Failed to fetch steps" }}
		}
	},
	updateStepList: async function(user_id, task_id, payload) {
		return { ok: true, data: [] }
	},
	updateGoalImages: async function(user_id, task_id, payload) {
		return { ok: true, data: [] }
	},
	updateGoodEnoughImages: async function(user_id, task_id, payload) {
		return { ok: true, data: [] }
	},
}

module.exports = TaskService