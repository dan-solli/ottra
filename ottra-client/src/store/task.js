import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const TaskRepo = RepositoryFactory.get('task')
const DocRepo = RepositoryFactory.get('document')

const Task = {
	state: {
		tasks: {
		}
	},
	getters: {
		getTasks: state => state.tasks,
		getTaskById: (state) => (id) => {
			return state.tasks[id]
		},
		getTaskDuration: (state) => (id) => {
			return { hours: 0, minutes: 4, seconds: 23 }
		},
	},
	mutations: {
		SET_TASKS(state, payload) {
			state.tasks = Object.assign({}, payload)
		},
		CLEAR_STORE(state) {
			state.tasks = {}
		},
		REMOVE_TASK(state, uuid) {
			Vue.delete(state.tasks, uuid)
		},
		ADD_TASK(state, payload) {
      Vue.set(state.tasks, payload.uuid, payload)			
		},
	},
	actions: {
		saveTask: async function({ commit, dispatch }, payload) {
			try {
				console.debug("%s: saveTask, payload is: %O", __filename, payload)
				const response = await TaskRepo.createTask(payload)
				commit("ADD_TASK", response.data)
				if (payload.goodEnoughImages.length > 0) {
					await dispatch("attachImagesToTask", {
						attachments: payload.goodEnoughImages,
						task_uuid: response.data.uuid,
						type: "goodEnoughImage"
					})
				}
				else if (payload.goalImages.length > 0) {
					await dispatch("attachImagesToTask", {
						attachments: payload.goalImages,
						task_uuid: response.data.uuid,
						type: "goalImage"
					})
				}
				return response.data
			} 
			catch(err) {
				console.error("%s: saveTask failed: %O", __filename, err)
			}
		},
		attachImagesToTask: async function({ commit, dispatch }, payload) {
			console.debug("%s: attachImageToTask payload is: %O", __filename, payload)
			try {
				payload.attachments.forEach(async function (attachment) {
					console.debug("%s: Calling DocRepo.createAssociation with %O", __filename, attachment)
					const response = await DocRepo.createAssociation({
						attachment: attachment,
						target: payload.task_uuid,
						type: payload.type
					})
					console.debug("%s: DocRepo.createAssociation response: %O", __filename, response)
				})
				await dispatch("loadTasks")
			}
			catch (err) {
				console.error("%s: attachImageToTask: %O", __filename, err)
			}
		},
		deleteTask: async function({ commit }, task_uuid) {
			try {
				console.debug("%s: deleteTask, payload is: %O", __filename, task_uuid)
				const response = await TaskRepo.deleteTask(task_uuid)
				commit("REMOVE_TASK", task_uuid)
				return response.data
			} 
			catch(err) {
				console.error("%s: deleteTask failed: %O", __filename, err)
			}
		},
		updateTask: async function({ commit }, payload) {
			try {
				console.debug("%s: updateTask, payload is: %O", __filename, payload)
				const response = await TaskRepo.updateTask(payload)
				commit("ADD_TASK", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: updateTask failed: %O", __filename, err)
			}
		},
		loadTasks: async function({ commit })	{
			try {
				const response = await TaskRepo.get()
				console.debug("%s: loadTasks: Response is %O", __filename, response)

				let new_tasks = {}

				response.data.forEach(function(task) {
					new_tasks[task.uuid] = task
				})
				commit("SET_TASKS", new_tasks)
			}
			catch(err) {
				console.error("%s: loadTasks failed: %O", __filename, err)
			}
		},
		loadUserData: async function({ dispatch }) {
			await dispatch("loadTasks")
		},
		clearStore({ commit }) {
			commit("CLEAR_STORE")
		}

	},
}

export default Task