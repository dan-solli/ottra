import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const RoomRepo = RepositoryFactory.get('room')

const Room = {
	state: {
    rooms: {
    }
	},
	mutations: {
    ADD_ROOM(state, payload) {
      Vue.set(state.rooms, payload.uuid, payload)
    },
    SET_ROOMS(state, payload) {
      console.debug("%s: SET_ROOMS payload = %O", __filename, payload)
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
    },
    getRoomTreeNodeById: (state, getters) => (id) => {
      const node = state.rooms[id]

      var childNodes = []
      if (node.storages.length > 0) {
        childNodes = childNodes.concat(node.storages.map(function (n) {
          return getters.getStorageTreeNodeById(n)
        }))
      }
      if (node.equipment.length > 0) {
        childNodes = childNodes.concat(node.equipment.map(function (n) {
          return getters.getEquipmentTreeNodeById(n)
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
        type: "room",
        icon: "mdi-floor-plan",
        children: childNodes,
        parent: { ...node.location }
      }
    },
    getRoomAutoCompleteNodeById: (state) => (id) => {
      const node = state.rooms[id]
      return {
        text: node.name,
        value: node.uuid,
        parent: { ...node.location }
      }
    },
    getRoomParent: (state, getters) => (id) => {
      const node = state.equipment[id]
      if (node.location.type[0] === "room") {
        return getters.getRoomByID(id)
      }
      return null
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
    fetchRoom: async function({ commit, dispatch, state }, { room_uuid, force_fetch = false }) {
      console.debug("%s: fetchRoom uuid: %s", __filename, room_uuid)

      try {
        if (!force_fetch) {
          console.debug("%s: fetchRoom, not forced!", __filename)
          if (state.rooms.hasOwnProperty(room_uuid)) {
            console.debug("%s: fetchRoom - had info in state", __filename)
            return state.rooms[room_uuid]
          } else {
            console.debug("%s: fetchRoom - data not found in state. Should fetch from backend.", __filename)
            force_fetch = true
          }
        }
        if (force_fetch) {
          console.debug("%s: fetchRoom - fetching from backend", __filename)
          const response = await RoomRepo.getRoom(room_uuid)
          console.debug("%s: RoomRepo.getRoom returns %O", __filename, response.data)
          commit("ADD_ROOM", response.data)
          await dispatch("hydrateRoom", response.data.uuid)
          return response.data
        } else {
          console.error("%s: fetchRoom: Dunno why we ended up here...")
        }
      }
      catch (err) {
        console.error("%s: fetchRoom failed: %s", __filename, err)
      }
    },
    hydrateRoom: async function({ state, dispatch }, room_uuid) {
      console.debug("%s: Trying to hydrate room: %s", __filename, room_uuid)
      if (!room_uuid || !state.rooms.hasOwnProperty(room_uuid)) {
        console.error("%s: hydrateRoom cannot find room %s", __filename, room_uuid)
      } else {
        const room = state.rooms[room_uuid]
        if (room.hasOwnProperty("visualAidImages") && room.visualAidImages.length > 0) {
          console.debug("%s: hydrateRoom - hydrating visualAidImages", __filename)
          await Promise.all(room.visualAidImages.map(async function (doc) {
            await dispatch("fetchDocument", { doc_uuid: doc })
          }))
        }
        if (room.hasOwnProperty("attachments") && room.attachments.length > 0) {
          console.debug("%s: hydrateRoom - hydrating attachments", __filename)
          await Promise.all(room.attachments.map(async function (doc) {
            await dispatch("fetchDocument", { doc_uuid: doc })
          }))
        }
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