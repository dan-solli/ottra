import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const StepRepo = RepositoryFactory.get('step')

const Step = {
	state: {
		steps: {
		}
	},
	getters: {
		getSteps: state => state.steps,
		getStepById: (state) => (id) => {
			return state.steps[id]
		},
	},
	mutations: {
		SET_STEPS(state, payload) {
			state.steps = Object.assign({}, payload)
		},
		CLEAR_STORE(state) {
			state.steps = {}
		},
		REMOVE_STEP(state, uuid) {
			Vue.delete(state.steps, uuid)
		},
		ADD_STEP(state, payload) {
      Vue.set(state.steps, payload.uuid, payload)			
		},
	},
	actions: {
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
		clearStore({ commit }) {
			commit("CLEAR_STORE")
		}

	},
}

export default Step