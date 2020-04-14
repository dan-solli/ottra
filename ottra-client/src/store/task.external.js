/**
* This file contains the actions and getters being used by components in the application
* It's a public layer, so to speak.
*/

import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const TaskRepo = RepositoryFactory.get('task')

const TaskExternal = {
	actions: {
		saveNewTask: async function({ dispatch }, payload) {
			console.debug("%s: saveNewTask, payload is: %O", __filename, payload)
			try {
				const response = await TaskRepo.createTask(payload)
				console.debug("%s: TaskRepo.createTask returns: %O", __filename, response.data)
				await dispatch("setTask", response.data)
				return response.data.uuid
			}
			catch(err) {
				console.error("%s: saveNewTask failed: %O", __filename, err)
			}
		},
		updateTask: async function({ dispatch }, payload) {
			console.debug("%s: updateTask, payload is: %O", __filename, payload)
			try {
				const response = await TaskRepo.updateTask(payload) // Should pass along list of steps.
				console.debug("%s: TaskRepo.updateTask returns: %O", __filename, response.data)
				await dispatch("setTask", response.data)
			}
			catch(err) {
				console.error("%s: updateTask failed: %O", __filename, err)
			}
		},
		deleteTask: async function({ dispatch }, task_uuid) {
			console.debug("%s: deleteTask, task_uuid is: %s", __filename, task_uuid)
			try {
				const response = await TaskRepo.deleteTask(task_uuid)
				console.debug("%s: TaskRepo.deleteTask returns: %O", __filename, response.data)
				await dispatch("removeTask", task_uuid)
			}
			catch(err) {
				console.error("%s: deleteTask failed: %O", __filename, err)
			}
		},
		addStepToTask: async function({ dispatch, state }, { task_uuid, step_uuid }) {
			console.debug("%s: addStepToTask task_uuid = %s, step_uuid = %s", 
				__filename, task_uuid, step_uuid)
			try {
				await dispatch("addStep", { task_uuid, step_uuid })
				await dispatch("updateTask", state.tasks[task_uuid])
			}
			catch(err) {
				console.error("%s: addStepToTask failed: %O", __filename, err)
			}
		},
		loadTasks: async function({ dispatch })	{
			try {
				const response = await TaskRepo.get()
				console.debug("%s: loadTasks: Response is %O", __filename, response.data)

				await response.data.forEach(async function(task) {
					await dispatch("loadTaskSteps", task.uuid)
					await dispatch("setTask", task)
				})
			}
			catch(err) {
				console.error("%s: loadTasks failed: %O", __filename, err)
			}
		},
		loadTaskSteps: async function({ dispatch }, task_uuid) {
			try {
				const response = await TaskRepo.getTaskSteps(task_uuid)
				console.debug("%s: loadTaskSteps return %O", __filename, response.data)

				response.data.forEach(function (step) {
					console.debug("%s: loadTaskSteps in loop: Var is: %O", __filename, step)
					dispatch("setStep", step)
				})		
			}
			catch (err) {
				console.error("%s: loadTaskSteps failed: %s", __filename, err)
			}
		},
	},
}

export default TaskExternal