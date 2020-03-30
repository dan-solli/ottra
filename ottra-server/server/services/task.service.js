const TaskModel = require('./../models/task.model')

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
			const result = await TaskModel.createTask(user_id, payload)
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
		const updateTaskResult = await TaskModel.updateTask(user_id, payload)
		return updateTaskResult
	}
}

module.exports = TaskService