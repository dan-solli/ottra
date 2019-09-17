import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const RoomRepo = RepositoryFactory.get('room')

const Room = {
	state: {
    rooms : {
    }
	},
	mutations: {
    ADD_ROOM(state, payload) {
      Vue.set(state.rooms, payload.uuid, payload)
    },
    SET_ROOMS(state, payload) {
      state.rooms = Object.assign({}, payload)
    },
    CLEAR_STORE(state) {
      state.rooms = {}
    }
 	},
	getters: {
    getRooms: state => state.rooms,
    getRoomByID: (state) => (id) => { 
      return state.rooms[id]
    }
	},
	actions: {
    createRoom: async function({ commit }, payload) {
      console.debug("%s: createRoom: Payload is: %O", __filename, payload)

      try {
        const response = await RoomRepo.createRoom(payload)
        commit("ADD_ROOM", response.data)
      }
      catch (err) {
        console.error("%s: createRoom failed: %s", __filename, err)
      }
    },
    loadRooms: async function({ commit }) {
      try {
        const response = await RoomRepo.getRooms()
        console.debug("%s: loadRooms: Response is %O", __filename, response)

        let new_rooms = {}
        response.data.forEach(function(loc) {
          new_rooms[loc.uuid] = loc
        })
        commit("SET_ROOMS", new_rooms)
      }
      catch (err) {
        console.error("%s: RoomRepo failed: %s", __filename, err)
      }
    },
    loadUserData: async function({ dispatch }) {
      await dispatch("loadRooms")
    },
    clearStore: function({ commit }) {
      commit("CLEAR_STORE")
    }
  }
}

export default Room