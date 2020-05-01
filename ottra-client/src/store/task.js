import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
import { StepFactory } from '@/common/repos/StepFactory'

const TaskRepo = RepositoryFactory.get('task')

const Task = {
	state: {
		tasks: { },
	},
	getters: {
		getTasks: state => state.tasks,
		getTaskById: (state) => (id) => {
			return state.tasks[id]
		},
		getTaskDuration: (state, getters) => (id) => {
			if (!state.tasks[id].steps.length) {
				return 262
			} else {
				return state.tasks[id].steps.reduce(function (acc, step_uuid, idx) {
					const step = getters.getStepById(step_uuid)
					if (!step) {
						return 6000
					}
					console.debug("%s: getTaskDuration: in reduce[%d]", __filename, idx)
					if (!step.hasOwnProperty('duration')) {
						console.debug("%s: getTaskDuration: No duration in step %O", __filename, step)
						return acc
					} else {
						var [ hr, min ] = step.duration.split(":")
						console.debug("%s: From step, got duration %d:%d", __filename, hr, min)
						return acc + parseInt(min) + parseInt(hr) * 60
					}
				}, 0)
			}
			return 263
		},
	},
	mutations: {
		ADD_TASK(state, payload) {
      Vue.set(state.tasks, payload.uuid, payload)
		},
		ADD_STEP_TO_TASK(state, { task_uuid, step_uuid }) {
			console.debug("%s: ADD_STEP_TO_TASK: task_uuid %s gets step_uuid %s",
				__filename, task_uuid, step_uuid)
			state.tasks[task_uuid].steps.push(step_uuid)
		},
		REMOVE_STEP_FROM_TASK(state, { task_uuid, step_uuid, step_position }) {
			state.tasks[task_uuid].steps.splice(step_position, 1)
		},
		CLEAR_STORE(state) {
			state.tasks = {}
		},
		DELETE_TASK(state, uuid) {
			Vue.delete(state.tasks, uuid)
		},
		SET_STEP_LIST(state, { task_uuid, stepList }) {
			Vue.set(state.tasks[task_uuid], "steps", stepList)
			Vue.set(state.tasks, "ARGH", 1)
			Vue.delete(state.tasks, "ARGH")
		}
/*		
		SET_TASKS(state, payload) {
			state.tasks = Object.assign({}, payload)
		},
		ADD_STEP(state, payload) {
			Vue.set(state.steps, payload.uuid, payload)
		},
		DELETE_STEP(state, step_uuid) {
			console.debug("%s: DELETE_STEP: uuid = %s", __filename, step_uuid)
			Vue.delete(state.steps, step_uuid)
		}
*/		
	},
	actions: {
		createTask: async function({ dispatch, commit }, payload) {
			console.debug("%s: createTask, payload is: %O", __filename, payload)
			try {
				var gei = [], gi = []
				// Extract things that need to be handled separately.
				if (payload.goodEnoughImages.length > 0) {
					gei = [...payload.goodEnoughImages]
				}
				delete payload.goodEnoughImages
				if (payload.goalImages.length > 0) {
					gei = [...payload.goalImages]
				}
				delete payload.goalImages

				const response = await TaskRepo.createTask(payload)
				console.debug("%s: TaskRepo.createTask returns: %O", __filename, response.data)

				const task_uuid = response.data.uuid

				console.debug("%s: Promise.all(saveGoalImages, saveGoodEnoughImages)", __filename)
				await Promise.all([ 
					TaskRepo.saveGoalImages(task_uuid, gi),
					TaskRepo.saveGoodEnoughImages(task_uuid, gei)
				])

				response.data.goodEnoughImages = [...gei]
				response.data.goalImages = [...gi]
				response.data.steps = []

				commit("ADD_TASK", response.data)
				console.debug("%s: createTask will return: %s", __filename, task_uuid)
				return task_uuid
			}
			catch(err) {
				console.error("%s: createTask failed: %s", __filename, err)
			}
		},
		addStepToTask: async function({ state, commit }, { task_uuid, step_uuid }) {
			console.debug("%s: addStepToTask task_uuid = %s, step_uuid = %s", 
				__filename, task_uuid, step_uuid)
			commit("ADD_STEP_TO_TASK", { task_uuid, step_uuid })
			console.debug("%s: state.tasks[task_uuid = %s].steps are: %O", 
				__filename, task_uuid, state.tasks[task_uuid].steps)

			await TaskRepo.saveStepList(task_uuid, state.tasks[task_uuid].steps)
		},
		deleteTask: async function({ commit, dispatch }, task_uuid) {
			try {
				console.debug("%s: deleteTask, payload is: %O", __filename, task_uuid)
				const response = await TaskRepo.deleteTask(task_uuid)
				commit("DELETE_TASK", task_uuid)
				return response.data
			} 
			catch(err) {
				console.error("%s: deleteTask failed: %O", __filename, err)
			}
		},
		updateStepList: async function({ commit, state }, task_uuid) {
			console.debug("%s: updateStepList called for task: %s", __filename, task_uuid)
			try {
				const stepList = state.tasks[task_uuid].steps
				const response = await TaskRepo.saveStepList(task_uuid, stepList)
				console.debug("%s: TaskRepo.saveStepList returned: %O", __filename, response.data)
				commit("SET_STEP_LIST", task_uuid, response.data)
				return response.data
			}
			catch (err) {
				console.error("%s: updateStepList failed: %s", __filename, err)
			}
		},
		fetchTask: async function({ state, dispatch, commit }, { 
			task_uuid, 
			force_fetch = false,
			force_hydrate = false
		}) {
			console.debug("%s: fetchTask called with: %s", __filename, task_uuid)
			try {
				if (!force_fetch) {
					if (state.tasks.hasOwnProperty(task_uuid)) {
						if (force_hydrate) {
							await dispatch("hydrateTask", task_uuid)
						}
						return state.tasks[task_uuid]
					} else {
						console.debug("%s: fetchTask - data not found in state. Fetching from backend.", __filename)
						force_fetch = true
					}
				}
				if (force_fetch) {
					console.debug("%s: fetchStep - fetching from backend", __filename)
					const response = await TaskRepo.getTask(task_uuid)
					commit("ADD_TASK", response.data)
					await dispatch("hydrateTask", task_uuid)
					return response.data
				}
			}
			catch (err) {
				console.error("%s: fetchTask failed: %s", __filename, err)				
			}
		},
		hydrateTask: async function({ state, dispatch }, task_uuid) {
			console.debug("%s: hydrateTask called with %s", __filename, task_uuid)
			if (!task_uuid || !state.tasks.hasOwnProperty(task_uuid)) {
				console.error("%s: hydrateTask cannot find task %s", __filename, task_uuid)
			}
			const task = state.tasks[task_uuid]
			console.debug("%s: Task data is %O", __filename, task)
			if (task.goodEnoughImages.length > 0) {
				console.debug("%s: calling fetchDocument for GEI", __filename)
				console.error("%s: Using forEach with await/async for goodEnoughImages", __filename)
				task.goodEnoughImages.forEach(async function (doc) {
					await dispatch("fetchDocument", { doc_uuid: doc })
				})
			}
			if (task.goalImages.length > 0) {
				console.debug("%s: calling fetchDocument for GI", __filename)
				console.error("%s: Using forEach with await/async for goalImages", __filename)
				task.goalImages.forEach(async function (doc) {
					await dispatch("fetchDocument", { doc_uuid: doc })
				})
			}
			if (task.steps.length > 0) {
				console.debug("%s: calling fetchStep for GEI")
				await Promise.all(task.steps.map(async function (step) {
					console.debug("%s: In loop to call fetchStep for step_uuid %s", __filename, step)
					await dispatch("fetchStep", { step_uuid: step })
				}))
			}
		},
		moveStepUp: async function({ commit, dispatch, state }, 
			{ task_uuid, step_uuid, step_position }) {
			try {
				if (step_position > 0) {
					const stepList = state.tasks[task_uuid].steps
					const tmpStep = stepList[step_position]
					stepList[step_position] = stepList[step_position-1]
					stepList[step_position-1] = tmpStep

					await TaskRepo.saveStepList(task_uuid, stepList) 
					commit("SET_STEP_LIST", { task_uuid, stepList })
				}
			}
			catch (err) {
				console.error("%s: moveStepUp failed: %s", __filename, err)
			}
		},
		moveStepDown: async function({ commit, state, dispatch }, 
			{ task_uuid, step_uuid, step_position }) {
			console.debug("%s: moveStepDown called on task %s, step %s, pos %d",
				__filename, task_uuid, step_uuid, step_position)

			try {
				let stepList = state.tasks[task_uuid].steps
				console.debug("%s: moveStepDown: stepList is %O", __filename, stepList)
				if (stepList.length > step_position) {
					[ stepList[step_position], stepList[step_position + 1]] = 
					[ stepList[step_position + 1], stepList[step_position]];
					console.debug("%s: moveStepDown: stepList is now: %O", __filename, stepList)
					await TaskRepo.saveStepList(task_uuid, stepList) 
					commit("SET_STEP_LIST", { task_uuid, stepList })
				}
			}
			catch (err) {
				console.error("%s: moveStepDown failed: %s", __filename, err)
			}
		},
// Generics?

		// In use.
		loadTasks: async function({ commit })	{
			try {
				const response = await TaskRepo.get()
				console.debug("%s: loadTasks: Response is %O", __filename, response.data)

				response.data.forEach(function(task) {
					commit("ADD_TASK", task)
				})
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
		saveTask: async function({ commit, dispatch }, payload) {
			try {
				console.debug("%s: saveTask, payload is: %O", __filename, payload)

				const response = await TaskRepo.createTask(payload)
				console.debug("%s: !!! TaskRepo.createTask returns: %O", __filename, response.data)
				commit("ADD_TASK", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: saveTask failed: %O", __filename, err)
			}
		},
		updateStep: async function({ commit }, { step_uuid, key, val }) {
			commit("UPDATE_STEP", { step_uuid, key, val })
		},
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
		saveNewTask: async function({ dispatch }, payload) {
			console.debug("%s: saveNewTask, payload is: %O", __filename, payload)
			try {
				const response = await TaskRepo.createTask(payload)
				console.debug("%s: TaskRepo.createTask returns: %O", __filename, response.data)
				await dispatch("setTask", response.data)
				console.debug("%s: saveNewTask will return: %s", __filename, response.data.uuid)
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
		addStepToTask: async function({ dispatch, getters }, { task_uuid, step_uuid }) {
			console.debug("%s: addStepToTask task_uuid = %s, step_uuid = %s", 
				__filename, task_uuid, step_uuid)
			try {
				await dispatch("addStep", { task_uuid, step_uuid })
				//await dispatch("updateTask", getters.getTaskById(task_uuid))
				const response = await TaskRepo.updateStepList(task_uuid, getters.getTaskById(task_uuid).steps)
				

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

*/		
	},
}

export default Task

/* Old code

/**
* This file contains the state, mutations and action as being used by the public layer of Vuex.
* It's a private layer, so to speak.
* This layer will not have any connection to the backend system.

import Vue from 'vue'

const TaskInternal = {
	state: {
		tasks: {
			// Key is task_id, steps contain an array of step id
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
	},
	mutations: {
/*		
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
		ADD_STEP_TO_TASK(state, { task_uuid, step_uuid }) {
			console.debug("%s: ADD_STEP_TO_TASK: task_uuid %s gets step_uuid %s",
				__filename, task_uuid, step_uuid)
			state.tasks[task_uuid].steps.push(step_uuid)
		},
		REMOVE_STEP_FROM_TASK(state, step_uuid) {
			console.debug("%s: REMOVE_STEP_FROM_TASK: step_uuid %s", __filename, step_uuid)
			Object.values(state.tasks).forEach(function (task) {
				var index = task.steps.indexOf(step_uuid)
				if (index !== -1) {
					console.debug("%s REMOVE_STEP_FROM_TASK: step removed from task %s", task.uuid)
					task.steps.splice(index, 1)
				}
			})
		}
	},
	actions: {
		addStep: async function({ commit }, payload) {
			console.debug("%s: addStep called with task_uuid: %s and step_uuid: %s", 
				__filename, payload.task_uuid, payload.step_uuid)
			commit("ADD_STEP_TO_TASK", payload)
		},
		setTask: async function({ commit }, task) {
			console.debug("%s: setTask called with task: %O", __filename, task)
			commit("ADD_TASK", task)
		},
		removeTask: async function({ commit }, task_uuid) {
			console.debug("%s: removeTask called with taskid: %s", __filename, task_uuid)
			commit("REMOVE_TASK", task_uuid)
		},
		removeStep: async function({ commit }, step_uuid) {
			console.debug("%s: removeStep called with stepid: %s", __filename, step_uuid)
			commit("REMOVE_STEP_FROm_TASK", step_uuid)
		},
	}
}

export default TaskInternal
/**
* This file contains the actions and getters being used by components in the application
* It's a public layer, so to speak.


import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const TaskRepo = RepositoryFactory.get('task')

const TaskExternal = {
	actions: {
	},
}

export default TaskExternal

*/