import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const StorageRepo = RepositoryFactory.get('storage')

const Storage = {
	state: {
    storages: {
    }
	},
	mutations: {
    ADD_STORAGE(state, payload) {
      Vue.set(state.storages, payload.uuid, payload)
    },
    SET_STORAGES(state, payload) {
      state.storages = Object.assign({}, payload)
    },
    CLEAR_STORE(state) {
      state.storages = {}
    }
 	},
	getters: {
    getStorages: state => state.storages,
    getStorageByID: (state) => (id) => { 
      return state.storages[id]
    }
	},
	actions: {
    createStorage: async function({ commit }, payload) {
      console.debug("%s: createStorage: Payload is: %O", __filename, payload)

      try {
        const response = await StorageRepo.createStorage(payload)
        commit("ADD_STORAGE", response.data)
      }
      catch (err) {
        console.error("%s: createStorage failed: %s", __filename, err)
      }
    },
    loadStorages: async function({ commit }) {
      try {
        const response = await StorageRepo.getStorages()
        console.debug("%s: loadStorages: Response is %O", __filename, response)

        let new_storages = {}
        response.data.forEach(function(item) {
          new_storages[item.uuid] = item
        })
        commit("SET_STORAGES", new_storages)
      }
      catch (err) {
        console.error("%s: StorageRepo failed: %s", __filename, err)
      }
    },
    loadUserData: async function({ dispatch }) {
      await dispatch("loadStorages")
    },
    clearStore: function({ commit }) {
      commit("CLEAR_STORE")
    }
  }
}

export default Storage