/**
* This file contains the state, mutations and action as being used by the public layer of Vuex.
* It's a private layer, so to speak.
* This layer will not have any connection to the backend system.
*/
import Vue from 'vue'

const StepInternal = {
	state: {
		steps: {
			// Key is step_id
		},
	},
	getters: {
		getStepById: (state) => (step_id) => {
			return state.steps[step_id]
		},
	},
	mutations: {
		ADD_STEP(state, payload) {
			Vue.set(state.steps, payload.uuid, payload)
		},
		UPDATE_STEP(state, { step_uuid, key, val }) {
			console.debug("%s: UPDATE_STEP: step_uuid %s gets key: %s and val: %O",
				__filename, step_uuid, key, val)
/*			
			const stepData = state.steps[step_uuid]
			console.debug("%s: UPDATE_STEP: stepData is %O", __filename, stepData)
			stepData[key] = val
			Vue.set(state.steps, step_uuid, stepData)
*/			
			Vue.set(state.steps[step_uuid], key, val)
		},
		DELETE_STEP(state, step_uuid) {
			console.debug("%s: DELETE_STEP: uuid = %s", __filename, step_uuid)
			Vue.delete(state.steps, step_uuid)
		}
	},
	actions: {
		setStep: function({ commit }, step) {
			console.debug("%s: setStep payload = %O", __filename, step)
			commit("ADD_STEP", step)
		},
		setStepValue: function({ commit }, payload) {
			console.debug("%s: setStepValue payload: %O", __filename, payload)
			commit("UPDATE_STEP", payload)
		}, 
		removeStep: function({ commit }, step_uuid) {
			console.debug("%s: removeStep uuid: %s", __filename, step_uuid)
			commit("DELETE_STEP", step_uuid)
		}
	}
}

export default StepInternal