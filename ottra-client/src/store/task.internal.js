/**
* This file contains the state, mutations and action as being used by the public layer of Vuex.
* It's a private layer, so to speak.
* This layer will not have any connection to the backend system.
*/
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
*/		
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
		clearStore: async function({ commit }) {
			commit("CLEAR_STORE")
		}
	}
}

export default TaskInternal

