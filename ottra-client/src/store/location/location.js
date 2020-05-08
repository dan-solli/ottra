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
      console.debug("%s: SET_LOCATIONS = %O", __filename, payload)
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
    getLocationTreeNodeById: (state, getters) => (id) => {
      if (!state.locations.hasOwnProperty(id)) {
        return {}
      }
      const node = state.locations[id]

      var childNodes = []
      if (node.rooms.length > 0) {
        childNodes = childNodes.concat(node.rooms.map(function (n) {
          return getters.getRoomTreeNodeById(n)
        }))
      }
      if (node.accessKeys.length > 0) {
        childNodes = childNodes.concat(node.accessKeys.map(function (n) {
          return getters.getEquipmentTreeNodeById(n)
        }))
      }
      return {
        id: node.uuid,
        name: node.name,
        type: "location",
        icon: "mdi-map-marker-outline",
        children: childNodes,
        parent: null
      }
    },
    getLocationAutoCompleteNodeById: (state) => (id) => {
      const node = state.locations[id]
      return {
        text: node.name,
        value: node.uuid,
        parent: null
      }
    },
    getLocationParent: (state) => (id) => {
      return null
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
    fetchLocation: async function({ state, dispatch, commit }, 
      { location_uuid, force_fetch }) {
      console.debug("%s: fetchLocation uuid: %s", __filename, location_uuid)

      try {
        if (!force_fetch) {
          console.debug("%s: fetchLocation, not forced!", __filename)
          if (state.locations.hasOwnProperty(location_uuid)) {
            console.debug("%s: fetchLocation - had info in state", __filename)
            return state.locations[locaction_uuid]
          } else {
            console.debug("%s: fetchLocation - data not found in state. Should fetch from backend.", __filename)
            force_fetch = true
          }
        }
        if (force_fetch) {
          console.debug("%s: fetchLocation - fetching from backend", __filename)
          const response = await LocationRepo.getLocation(location_uuid)
          console.debug("%s: LocationRepo.getLocation returns %O", __filename, response.data)
          commit("ADD_LOCATION", response.data)
          await dispatch("hydrateLocation", response.data.uuid)
          return response.data
        } else {
          console.error("%s: fetchLocation: Dunno why we ended up here...")
        }
      }
      catch (err) {
        console.error("%s: fetchLocation failed: %s", __filename, err)
      }
    },
    hydrateLocation: async function({ state, dispatch }, loc_uuid) {
    // Not supporting attachments or visual Aids yet...
    // It does have a list of rooms and accessKeys - which may or may not have to be hydrated. 
    // ... but probably not. 
/*
      console.debug("%s: Trying to hydrate location: %s", __filename, loc_uuid)
      if (!loc_uuid || !state.locations.hasOwnProperty(loc_uuid)) {
        console.error("%s: hydrateLocation cannot find step %s", __filename, loc_uuid)
      } else {
        const loc = state.locations[loc_uuid]
        if (loc.hasOwnProperty("visualAidImages") && loc.visualAidImages.length > 0) {
          console.debug("%s: hydrateLocation - hydrating visualAidImages", __filename)
          await Promise.all(loc.visualAidImages.map(async function (doc) {
            await dispatch("fetchDocument", { doc_uuid: doc })
          }))
        }
        if (loc.hasOwnProperty("attachments") && loc.attachments.length > 0) {
          console.debug("%s: hydrateLocation - hydrating attachments", __filename)
          await Promise.all(loc.attachments.map(async function (doc) {
            await dispatch("fetchDocument", { doc_uuid: doc })
          }))
        }
      }
*/      
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