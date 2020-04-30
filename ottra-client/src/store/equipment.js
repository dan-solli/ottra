import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const EquipmentRepo = RepositoryFactory.get('equipment')

const Equipment = {
	state: {
		equipment: {
		}
	},
	getters: {
		getEquipment: state => state.equipment,
	},
	mutations: {
		SET_EQUIPMENT(state, payload) {
			state.equipment = Object.assign({}, payload)
		},
		CLEAR_STORE(state) {
			state.equipment = {}
		},
		ADD_EQUIPMENT(state, payload) {
      Vue.set(state.equipment, payload.uuid, payload)			
		}
	},
	actions: {
		createEquipment: async function({ commit }, payload) {
			try {
				console.debug("%s: createEquipment, payload is: %O", __filename, payload)
				const response = await EquipmentRepo.createEquipment(payload)
				console.debug("%s: createEquipment, response.data is: %O", __filename, response.data)
				commit("ADD_EQUIPMENT", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: saveEquipment failed: %O", __filename, err)
			}
		},
		fetchEquipment: async function({ state, dispatch, commit }, { equipment_uuid, force_fetch = false }) {
			console.debug("%s: fetchEquipment called with: %s", __filename, equipment_uuid)
			try {
				if (!force_fetch) {
					if (state.equipment.hasOwnProperty(equipment_uuid)) {
						return state.equipment[equipment_uuid]
					} else {
						console.debug("%s: fetchEquipment - data not found in state. Fetching from backend", __filename)
						force_fetch = true
					}
				}
				if (force_fetch) {
					console.debug("%s: fetchEquipment - fetching from backend", __filename)
					const response = await EquipmentRepo.getEquipment(equipment_uuid)
					console.debug("%s: fetchEquipment - response is %O", __filename, response.data)
					commit("ADD_EQUIPMENT", response.data)
					await dispatch("hydrateEquipment", equipment_uuid)
					return response.data
				}
			}
			catch (err) {
				console.error("%s: fetchEquipment failed: %s", __filename, err)
			}
		},
		hydrateEquipment: async function({ state, dispatch }, equipment_uuid) {
			console.debug("%s: hydrateEquipment called with %s", __filename, equipment_uuid) 
			if (!equipment_uuid || !state.equipment.hasOwnProperty(equipment_uuid)) {
				console.error("%s: hydrateEquipment cannot find step %s", __filename, equipment_uuid)
			} else {
				const eq = state.equipment[equipment_uuid]
				if (eq.hasOwnProperty("visualAidImages") && eq.visualAidImages.length > 0) {
					console.debug("%s: hydrateEquipment - hydrating visualAidImages", __filename)
					await Promise.all(eq.visualAidImages.map(async function (doc) {
						await dispatch("fetchDocument", { doc_uuid: doc })
					}))
				}
				if (eq.hasOwnProperty("attachments") && eq.attachments.length > 0) {
					console.debug("%s: hydrateEquipment - hydrating attachments", __filename)
					await Promise.all(eq.attachments.map(async function (doc) {
						await dispatch("fetchDocument", { doc_uuid: doc })
					}))
				}
			}
		},
		loadEquipment: async function({ commit })	{
			try {
				const response = await EquipmentRepo.get()
				console.debug("%s: loadEquipment: Response is %O", __filename, response)

				let new_equipment = {}

				response.data.forEach(function(eq) {
					new_equipment[eq.uuid] = eq
				})
				commit("SET_EQUIPMENT", new_equipment)
			}
			catch(err) {
				console.error("%s: loadEquipment failed: %O", __filename, err)
			}
		},
		loadUserData: async function({ dispatch }) {
			await dispatch("loadEquipment")
		},
		clearStore({ commit }) {
			commit("CLEAR_STORE")
		}

	},
}

export default Equipment