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
		// In use
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
		// In use
		updateStepValue: async function({ commit }, payload) {
			try {
				console.debug("%s: updateStepValue payload: %O", __filename, payload)
				commit("SET_STEP_VALUE", payload)
			}
			catch (err) {
				console.error("%s: commit SET_STEP_VALUE failed: %O", __filename, err)
			}
		},
		// In progress
		updateStep: async function({ dispatch }, payload) {
			console.debug("%s: updateStep called with %O", __filename, payload)

			try {
				if (payload.visualAidImages.length > 0) {
					await StepRepo.saveVisualAidImages(payload.uuid. payload.visualAidImages)
				}
				if (payload.stepType === STEP_INSTRUCTION ||
					  payload.stepType === STEP_TRANSPORT) {
					if (payload.attachments.length > 0) {
						await StepRepo.saveAttachments(payload.uuid, payload.attachments)
					}
				}
				if (payload.stepType === STEP_INSTRUCTION) {
					if (payload.tools.length > 0) {
						await StepRepo.saveTools(payload.uuid, payload.tools)
					}
				}
				delete payload.visualAidImages
				delete payload.attachments
				delete payload.tools

				const response = await StepRepo.updateStep(payload)
				console.debug("%s: updateStep response is: %O", __filename, response.data)
				commit("ADD_STEP", response.data)
			}
			catch (err) {
				console.error("%s: updateStep failed: %s", __filename, err)
			}
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
		},
		fetchStep: async function({ state, dispatch, commit }, { step_uuid, force_fetch = false }) {
			console.debug("%s: fetchStep uuid: %s", __filename, step_uuid)

			try {
				if (!force_fetch) {
					console.debug("%s: fetchStep, not forced!", __filename)
					if (state.steps.hasOwnProperty(step_uuid)) {
						console.debug("%s: fetchStep - had info in state", __filename)
						return state.steps[step_uuid]
					} else {
						console.debug("%s: fetchStep - data not found in state. Should fetch from backend.", __filename)
						force_fetch = true
					}
				}
				console.debug("%s: fetchStep halftime. uuid = %s, force_fetch = %O",
					__filename, step_uuid, force_fetch)
				if (force_fetch) {
					console.debug("%s: fetchStep - fetching from backend", __filename)
					const response = await StepRepo.getStep(step_uuid)
					console.debug("%s: StepRepo.getStep returns %O", __filename, response.data)
					commit("ADD_STEP", response.data)
					await dispatch("hydrateStep", response.data.uuid)
					return response.data
				} else {
					console.error("%s: fetchStep: Dunno why we ended up here...")
				}
			}
			catch (err) {
				console.error("%s: fetchStep failed: %s", __filename, err)
			}
		},
		hydrateStep: async function({ state, dispatch }, step_uuid) {
			console.debug("%s: Trying to hydrate step: %s", __filename, step_uuid)
			if (!step_uuid || !state.steps.hasOwnProperty(step_uuid)) {
				console.error("%s: hydrateStep cannot find step %s", __filename, step_uuid)
			}
			const step = state.steps[step_uuid]
			if (step.hasOwnProperty("visualAidImages") && step.visualAidImages.length > 0) {
				await Promise.all(step.visualAidImages.map(async function (doc) {
					await dispatch("fetchDocument", doc)
				}))
			}
			if (step.hasOwnProperty("attachments") && step.attachments.length > 0) {
				await Promise.all(step.attachments.map(async function (doc) {
					await dispatch("fetchDocument", doc)
				}))
			}
			if (step.hasOwnProperty("tools") && step.tools.length > 0) {
				await Promise.all(step.tools.map(async function (tool) {
					await dispatch("fetchEquipment", tool)
				}))
			}
			/* Too deep recursion problem? */
			if (step.hasOwnProperty("task") && step.task.length > 0) {
				await dispatch("fetchTask", step.task)
			}
			if (step.hasOwnProperty("destination") && step.destination.length > 0) {
				await dispatch("fetchLocation", step.destination)
			}
			if (step.hasOwnProperty("stepLocation") && step.stepLocation.length > 0) {
				await dispatch("fetchRoom", step.stepLocation)
			}
		},
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

/** Step-internal

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
			const stepData = state.steps[step_uuid]
			console.debug("%s: UPDATE_STEP: stepData is %O", __filename, stepData)
			stepData[key] = val
			Vue.set(state.steps, step_uuid, stepData)
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
	}
}

export default StepInternal
**/

/** Step-external
/**
* This file contains the actions and getters being used by components in the application
* It's a public layer, so to speak.

import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
import { StepFactory } from '@/common/repos/StepFactory'

const StepRepo = RepositoryFactory.get('step')

const StepExternal = {
	actions: {
		updateStepValue: async function({ dispatch }, payload) {
			await dispatch("setStepValue", payload)
		},
		// When an already created step is being saved.
		updateStep: async function({ dispatch }, payload) {
			console.debug("%s: updateStep called with %O", __filename, payload)

			try {
				const response = await StepRepo.updateStep(payload)
				console.debug("%s: saveStep/update response is: %O", __filename, response.data)
				await dispatch("setStep", response.data)
			}
			catch (err) {
				console.error("%s: updateStep failed: %s", __filename, err)
			}
		},
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
		// Creating steps without tying it to a task is unpossible, atm
		createNewStep: async function({ dispatch }, payload) {
			const { task_uuid, step_type } = payload
			try {
				console.debug("%s: createNewStep, steptype is: %d, task is: %s", __filename, step_type, task_uuid)
				const stepData = StepFactory.getStepData(step_type)
				console.debug("%s: createNewStep: Factory returned step data: %O", __filename, stepData)

				const response = await StepRepo.createStep(stepData)
				console.debug("%s: createNewStep: stepRepo.createStep returns %O", __filename, response.data)
				await dispatch("setStep", response.data)
				await dispatch("addStepToTask", { // This will be responsible for backend save of the step with the task. 
					task_uuid: task_uuid,
					step_uuid: response.data.uuid,
				})
				return response.data.uuid
			}
			catch(err) {
				console.error("%s: createNewStep failed: %O", __filename, err)
			}
		}

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
	}
}

export default StepExternal
**/
