import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
import { 
	StepFactory,
	STEP_INSTRUCTION,
	STEP_PAUSE,
	STEP_TRANSPORT,
	STEP_TASK
} from '@/common/repos/StepFactory'

const StepRepo = RepositoryFactory.get('step')

const Step = {
	state: {
		steps: { }
	},
	getters: {
		//getSteps: state => state.steps,
		getStepById: (state) => (id) => {
			return state.steps[id]
		},
	},
	mutations: {
/*		
		SET_STEPS(state, payload) {
			state.steps = Object.assign({}, payload)
		},
		REMOVE_STEP(state, uuid) {
			Vue.delete(state.steps, uuid)
		},
*/		
		ADD_STEP(state, payload) {
      Vue.set(state.steps, payload.uuid, payload)			
		},
		SET_STEP_VALUE(state, { step_uuid, key, val }) {
			console.debug("%s: SET_STEP_VALUE: step_uuid %s gets key: %s and val: %O",
				__filename, step_uuid, key, val)
			Vue.set(state.steps[step_uuid], key, val)
		},
		CLEAR_STORE(state) {
			state.steps = {}
		},
	},
	actions: {
		createNewStep: async function({ dispatch, commit }, { step_type, task_uuid }) {
			console.debug("%s: createNewStep, steptype is: %d, task is: %s", __filename, step_type, task_uuid)
			try {
				const stepData = StepFactory.getStepData(step_type)
				console.debug("%s: createNewStep: Factory returned step data: %O", __filename, stepData)

				// Extract things that need to be handled separately. At this point, we should not really do
				// anything at all with it, namely because they can't exist. What we want at this point is the
				// uuid from the server side and the most basic data set based on type. So fields can be deleted
				// without further ado. 

				const saveNewStep = { 
					description		: stepData.description,
					duration			: stepData.duration,
					energyExpense	: stepData.energyExpense,
					optionalStep	: stepData.optionalStep,
					stepType 			: stepData.stepType,
					title					: stepData.title
				}

				if (step_type === STEP_INSTRUCTION) {
					saveNewStep.stepLocation = ''
				} else if (step_type === STEP_PAUSE) {
					/* Empty for now */
				} else if (step_type === STEP_TRANSPORT) {
					saveNewStep.destination = ''
					saveNewStep.method = ''
				} else if (step_type === STEP_TASK) {
					/* Empty for now */
				}

				const response = await StepRepo.createStep(saveNewStep)

				// The response should be the full step, including all those empty relations...
				console.debug("%s: createNewStep: stepRepo.createStep returns %O", __filename, response.data)

				commit("ADD_STEP", response.data)
				await dispatch("addStepToTask", { 
					task_uuid: task_uuid,
					step_uuid: response.data.uuid,
				})
				return response.data.uuid
			}
			catch(err) {
				console.error("%s: createNewStep failed: %O", __filename, err)
			}
		},
		updateStepValue: async function({ commit }, payload) {
			try {
				console.debug("%s: updateStepValue payload: %O", __filename, payload)
				commit("SET_STEP_VALUE", payload)
			}
			catch (err) {
				console.error("%s: commit SET_STEP_VALUE failed: %O", __filename, err)
			}
		},
		updateStep: async function({ dispatch }, payload) {
			console.debug("%s: updateStep called with %O", __filename, payload)

/*
			try {
				const response = await StepRepo.updateStep(payload)
				console.debug("%s: updateStep response is: %O", __filename, response.data)
				commit("ADD_STEP", response.data)
			}
			catch (err) {
				console.error("%s: updateStep failed: %s", __filename, err)
			}
*/			
		},
		removeStep: async function({ commit, dispatch }, { task_uuid, step_uuid }) {
			console.debug("%s: removeStep uuid: %s from task uuid: %s", 
				__filename, step_uuid, task_uuid)
			try {
				commit("REMOVE_STEP_FROM_TASK", { task_uuid, step_uuid })
				await dispatch("updateStepList", task_uuid)
			}
			catch (err) {
				console.error("%s: removeStep failed: %s", __filename, err)
			}
		},
		clearStore: async function({ commit }) {
			commit("CLEAR_STORE")
		}
/*		
		deleteStep: async function({ dispatch }, step_uuid) {
			console.debug("%s: deleteStep, uuid is: %s", __filename, step_uuid)

			try {
				const response = await StepRepo.deleteStep(step_uuid)
				// Please note, removeStep is implemented in both step.internal and task.internal!
				dispatch("removeStep", step_uuid)
			}
			catch (err) {
				console.error("%s: deleteStep failed: %s", err)
			}
		},
*/
	}
}

export default Step