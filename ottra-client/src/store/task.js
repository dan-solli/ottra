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
		},
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
		},
		DELETE_STEP(state, step_uuid) {
			console.debug("%s: DELETE_STEP: uuid = %s", __filename, step_uuid)
			Vue.delete(state.steps, step_uuid)
		}
	},
	actions: {
		// Called by AddStepToTask-view when a new step is requested. 
		// Does not save to backend.
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
		// Called by AddStepToTask-view right after a new step has been requested.
		// Does not save to backend.
		addStepToTask: async function({ commit, dispatch }, { task_uuid, step_uuid }) {
			console.debug("%s: addStepToTask task_uuid = %s, step_uuid = %s", 
				__filename, task_uuid, step_uuid)
			commit("ADD_STEP_TO_TASK", { task_uuid, step_uuid })
		},
		// Called from AddStepToTask-view when the 'save' button is pressed.
		// Saves to backend!
		updateTask: async function({ commit }, payload) {
			try {
				console.debug("%s: updateTask, payload is: %O", __filename, payload)
				const response = await TaskRepo.updateTask(payload)

				console.debug("%s: !!! TaskRepo.updateTask returns: %O", __filename, response.data)
				response.data.steps = response.data.steps.forEach(function (f) {
					commit("ADD_STEP", f)
					return f.uuid
				})
				console.debug("%s: updateTask, converted: %O", __filename, response.data)
				commit("ADD_TASK", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: updateTask failed: %O", __filename, err)
			}
		},
		// Called from CreateTask-view. 
		// Saves to backend!
		saveTask: async function({ commit, dispatch }, payload) {
			try {
				console.debug("%s: saveTask, payload is: %O", __filename, payload)

				// TODO: Rename to createTask

				const response = await TaskRepo.createTask(payload)
				console.debug("%s: !!! TaskRepo.createTask returns: %O", __filename, response.data)
				commit("ADD_TASK", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: saveTask failed: %O", __filename, err)
			}
		},
		// Event-based update of a step while editing a form. Called from Mixin.
		// Does not save to backend.
		updateStep: async function({ commit }, { step_uuid, key, val }) {
			commit("UPDATE_STEP", { step_uuid, key, val })
		},
		// Common method for saving a step, saves or updates depending on state of step.
		// This should be split into two, most likely. 
		saveStep: async function({ commit, dispatch }, step) {
			console.debug("%s: saveStep called with %O", __filename, step)
			if (step.saveStatus === false) {
				return await dispatch("createStep", step)
			} else {
				try {
					const response = await StepRepo.updateStep(step)
					console.debug("%s: saveStep/update response is: %O", __filename, response.data)
					commit("ADD_STEP", response.data)
				}
				catch (err) {
					console.error("%s: saveStep/update failed: %s", __filename, err)
				}
			}
		},
		// Called by action saveStep.
		// Saves to backend, updates Vuex with result.
		createStep: async function({ commit, dispatch }, step) {
			console.debug("%s: createStep called with %O", __filename, step)
			try {
				await dispatch("updateStep", {
					step_uuid: step.uuid,
					key: "saveStatus",
					value: true
				})
				step.saveStatus = true
				const response = await StepRepo.createStep(step)
				console.debug("%s: createStep response was %O", __filename, response.data)
				commit("ADD_STEP", response.data)
			}
			catch (err) {
				console.error("%s: createStep failed: %s", __filename, err)
			}
		},
		deleteTask: async function({ commit, dispatch }, task_uuid) {
			try {
				console.debug("%s: deleteTask, payload is: %O", __filename, task_uuid)
				const response = await TaskRepo.deleteTask(task_uuid)
				commit("REMOVE_TASK", task_uuid)
				// TODO: Horrible solution, but easiest to accomplish current goal.
				await dispatch("loadTasks")
				return response.data
			} 
			catch(err) {
				console.error("%s: deleteTask failed: %O", __filename, err)
			}
		},
		// Currently not implemented. 
		deleteStep: async function({ commit }, step_uuid) {
			try {
				console.debug("%s: deleteStep, uuid is: %s", __filename, step_uuid)
				const response = await StepRepo.deleteStep(step_uuid)
				commit("DELETE_STEP", step_uuid)
				return response.data
			}
			catch (err) {
				console.error("%s: deleteStep failed: %s", err)
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
		loadTaskSteps: async function({ commit }, task_uuid) {
			try {
				const response = await TaskRepo.getTaskSteps(task_uuid)
				console.debug("%s: loadTaskSteps return %O", __filename, response.data)

				response.data.forEach(function (step) {
					console.debug("%s: loadTaskSteps in loop: Var is: %O", __filename, step)
					commit("ADD_STEP", step)
				})		
			}
			catch (err) {
				console.error("%s: loadTaskSteps failed: %s", __filename, err)
			}
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