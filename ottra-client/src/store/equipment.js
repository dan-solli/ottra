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
		fetchEquipment: async function({ dispatch, commit }, equipment_uuid) {
			// hydrateEquipment
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