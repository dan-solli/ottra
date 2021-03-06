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
			try {
				const [ task, steps ] = await Promise.all([
					TaskModel.getTask(user_id, task_id),
					TaskModel.getSteps(user_id, task_id)
				])

				console.debug("%s: getTask responses are task = %O, steps = %O",
					__filename, task, steps)

				task.data.steps = steps.data
				return task
			}
			catch (err) {
				console.error("%s: getTask failed: %s", __filename, err)
			}
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
	// In use
	updateStepList: async function(user_id, task_id, payload) {
		// Delete references to steps. 
		const oldStepList = await TaskModel.getSteps(user_id, task_id)
		console.debug("%s: updateStepList: oldStepList = %O", __filename, oldStepList)
		if (oldStepList.ok) {
			if (oldStepList.data.length > 0) {
				await CommonService.removeRelations(task_id, oldStepList.data)
			}
		}
		var order = 0
		await Promise.all(payload.steps.map(async function(dest) {
			console.debug("%s: updateStepList: trying to create relation between %s and %s", __filename, task_id, dest)
			await CommonService.createRelation(task_id, dest, "INCLUDES", { order : order++ })
		}))
		return await TaskModel.getSteps(user_id, task_id)
	},
	updateGoalImages: async function(user_id, task_id, payload) {
		return { ok: true, data: [] }
	},
	updateGoodEnoughImages: async function(user_id, task_id, payload) {
		return { ok: true, data: [] }
	},
}

module.exports = TaskService