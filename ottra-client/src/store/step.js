import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
import { StepFactory } from '@/common/repos/StepFactory'

const StepRepo = RepositoryFactory.get('step')

const Step = {
	state: {
		steps: []
	},
	getters: {
		getSteps: state => state.steps,
/*
		getStepById: (state) => (id) => {
			return state.steps[id]
		},
*/		
	},
	mutations: {
		SET_STEPS(state, payload) {
			state.steps = Object.assign({}, payload)
		},
		CLEAR_STORE(state) {
			state.steps = {}
		},
/*		
		REMOVE_STEP(state, uuid) {
			Vue.delete(state.steps, uuid)
		},
*/		
		ADD_STEP(state, payload) {
			state.steps.push(payload)
      //Vue.set(state.steps, payload.uuid, payload)			
		},
	},
	actions: {
		newStep: async function({ commit }, step_type) {
			try {
				console.debug("%s: newStep, steptype is: %d", __filename, step_type)
				const stepData = StepFactory.getStepData(step_type)
				// --- Missing task-id. And that should not be required.
				// --- 
				// const response = await StepRepo.createStep(stepData)

				commit("ADD_STEP", stepData)
				return response.data.uuid
			}
			catch(err) {
				console.error("%s: newStep failed: %O", __filename, err)
			}
		},
		clearStore({ commit }) {
			commit("CLEAR_STORE")
		}

	},
}

export default Step