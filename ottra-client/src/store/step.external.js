/**
* This file contains the actions and getters being used by components in the application
* It's a public layer, so to speak.
*/

import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const StepRepo = RepositoryFactory.get('step')

const StepExternal = {
	getters: {
		getStepById: (state) => (step_id) => {
			return state.steps[step_id]
		},
	},
	actions: {
		updateStepValue: async function({ dispatch }, payload) {
			await dispatch("setStepValue", payload)
		},
		// When an already created step is being saved.
		updateStep: async function({ dispatch }, payload) {
			console.debug("%s: updateStep called with %O", __filename, step)

			try {
				const response = await StepRepo.updateStep(step)
				console.debug("%s: saveStep/update response is: %O", __filename, response.data)
				await dispatch("setStep", response.data)
			}
			catch (err) {
				console.error("%s: saveStep/update failed: %s", __filename, err)
			}
		},
		deleteStep: async function({ dispatch }, step_uuid) {
			console.debug("%s: deleteStep, uuid is: %s", __filename, step_uuid)

			try {
				const response = await StepRepo.deleteStep(step_uuid)
				dispatch("removeStep", step_uuid)
			}
			catch (err) {
				console.error("%s: deleteStep failed: %s", err)
			}
		},
		// Creating steps without tying it to a task is unpossible, atm
		createNewStep: async function({ dispatch }, payload) {
			const { task_uuid, step_type } = payload
			try {
				console.debug("%s: createNewStep, steptype is: %d, task is: %s", __filename, step_type, task_uuid)
				const stepData = StepFactory.getStepData(step_type)
				console.debug("%s: createNewStep: Factory returned step data: %O", __filename, stepData)

				const response = StepRepo.createStep(stepData)
				console.debug("%s: createNewStep: addStepToTask returns %O", __filename, response.data)
				await dispatch("setStep", response.data)
				await dispatch("addStepToTask", { // This will be responsible for backend save of the step with the task. 
					task_uuid: task_uuid,
					step_uuid: respose.data.uuid,
				})
				return response.data.uuid
			}
			catch(err) {
				console.error("%s: createNewStep failed: %O", __filename, err)
			}
		}

		// Called by action saveStep.
		// Saves to backend, updates Vuex with result.
/*		
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
*/	
	}
}

export default StepExternal