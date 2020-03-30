import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
import { StepFactory } from '@/common/repos/StepFactory'

const TaskRepo = RepositoryFactory.get('task')
const DocRepo = RepositoryFactory.get('document')
const StepRepo = RepositoryFactory.get('step')

const Task = {
	state: {
		tasks: {
			// Key is task_id, steps contain an array of step id
		},
		steps: {
			// Key is step_id
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
		getStepById: (state) => (step_id) => {
			return state.steps[step_id]
		},
	},
	mutations: {
		SET_TASKS(state, payload) {
			state.tasks = Object.assign({}, payload)
		},
		CLEAR_STORE(state) {
			state.tasks = {}
			state.steps = {}
		},
		REMOVE_TASK(state, uuid) {
			Vue.delete(state.tasks, uuid)
		},
		ADD_TASK(state, payload) {
      Vue.set(state.tasks, payload.uuid, payload)			
		},
		ADD_STEP_TO_TASK(state, { task_uuid, step_uuid }) {
			console.debug("%s: ADD_STEP_TO_TASK: task_uuid %s gets step_uuid %s",
				__filename, task_uuid, step_uuid)
			state.tasks[task_uuid].steps.push(step_uuid)
		},
		ADD_STEP(state, payload) {
			Vue.set(state.steps, payload.uuid, payload)
		},
		UPDATE_STEP(state, { step_uuid, key, val }) {
			console.debug("%s: UPDATE_STEP: step_uuid %s gets key: %s and val: %O",
				__filename, step_uuid, key, val)
			const stepData = state.steps[step_uuid]
			console.debug("%s: UPDATE_STEP: stepData is %O", __filename, stepData)
			stepData[key] = val
			Vue.set(state.steps, step_uuid, stepData)
		}
	},
	actions: {
		newStep: async function({ commit }, step_type) {
			try {
				console.debug("%s: newStep, steptype is: %d", __filename, step_type)
				const stepData = StepFactory.getStepData(step_type)
				console.debug("%s: newStep: Factory returned step data: %O", __filename, stepData)
				commit("ADD_STEP", stepData)
				console.debug("%s: newStep: returning: %s", __filename, stepData.uuid)
				return stepData.uuid
			}
			catch(err) {
				console.error("%s: newStep failed: %O", __filename, err)
			}
		},
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
		addStepToTask: async function({ commit }, { task_uuid, step_uuid }) {
			console.debug("%s: addStepToTask task_uuid = %s, step_uuid = %s", 
				__filename, task_uuid, step_uuid)
			commit("ADD_STEP_TO_TASK", { task_uuid, step_uuid })
		},
		updateStep: async function({ commit }, { step_uuid, key, val }) {
			console.debug("%s: updateStep called with step_uuid = %s, key = %s, val = %O",
				__filename, step_uuid, key, val)
			commit("UPDATE_STEP", { step_uuid, key, val })
		},
		saveStep: async function({ commit }, step) {
			console.debug("%s: saveStep called with %O", __filename, step)
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
/*		
		saveStep: async function({ commit }, payload) {
			try {
				console.debug("%s: saveStep, payload is: %O", __filename, payload)
				const response = await StepRepo.createStep(payload)
				commit("ADD_STEP", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: saveStep failed: %O", __filename, err)
			}
		},
		deleteStep: async function({ commit }, step_uuid) {
			try {
				console.debug("%s: deleteStep, payload is: %O", __filename, step_uuid)
				const response = await StepRepo.deleteStep(step_uuid)
				commit("REMOVE_STEP", step_uuid)
				return response.data
			} 
			catch(err) {
				console.error("%s: deleteStep failed: %O", __filename, err)
			}
		},
		updateStep: async function({ commit }, payload) {
			try {
				console.debug("%s: updateStep, payload is: %O", __filename, payload)
				const response = await StepRepo.updateStep(payload)
				commit("ADD_STEP", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: updateStep failed: %O", __filename, err)
			}
		},
		loadSteps: async function({ commit })	{
			try {
				const response = await StepRepo.get()
				console.debug("%s: loadSteps: Response is %O", __filename, response)

				let new_steps = {}

				response.data.forEach(function(step) {
					new_steps[step.uuid] = step
				})
				commit("SET_STEPS", new_steps)
			}
			catch(err) {
				console.error("%s: loadSteps failed: %O", __filename, err)
			}
		},
		loadUserData: async function({ dispatch }) {
			await dispatch("loadSteps")
		},
*/		

	},
}

export default Task