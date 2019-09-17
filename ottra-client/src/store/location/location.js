import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const LocationRepo = RepositoryFactory.get('location')

const Location = {
	state: {
    locations : {
    }
	},
	mutations: {
    ADD_LOCATION(state, payload) {
      Vue.set(state.locations, payload.uuid, payload)
    },
    SET_LOCATIONS(state, payload) {
      state.locations = Object.assign({}, payload)
    },
    CLEAR_STORE(state) {
      state.locations = {}
    },
    DELETE_LOCATION(state, loc_id) {
      Vue.delete(state.locations, loc_id)
    }
	},
	getters: {
    getLocations: state => state.locations,
    getLocationByID: (state) => (id) => { 
      return state.locations[id]
    },
	},
	actions: {
    createLocation: async function({ commit }, payload) {
      console.debug("%s: createLocation: Payload is: %O", __filename, payload)

      try {
        const response = await LocationRepo.createLocation(payload)
        commit("ADD_LOCATION", response.data)
      }
      catch (err) {
        console.error("%s: createLocation failed: %s", __filename, err)
      }
    },
    deleteLocation: async function({ commit }, location_id) {
      console.debug("%s: deleteLocation: Payload is: %s", __filename, location_id)

      try {
        const response = await LocationRepo.deleteLocation(location_id)
        commit("DELETE_LOCATION", location_id)
      }
      catch (err) {
        console.error("%s: deleteLocation failed: %s", __filename, err)
      }
    },
    loadLocations: async function({ commit }) {
      try {
        const response = await LocationRepo.get()
        console.debug("%s: loadLocations: Response is %O", __filename, response)

        let new_locations = {}
        response.data.forEach(function(loc) {
          new_locations[loc.uuid] = loc
        })
        commit("SET_LOCATIONS", new_locations)
      }
      catch (err) {
        console.error("%s: LocationRepo failed: %s", __filename, err)
      }
    },
    loadUserData: async function({ dispatch }) {
      await dispatch("loadLocations")
    },
    clearStore: function({ commit }) {
      commit("CLEAR_STORE")
    }
	}
}

export default Location