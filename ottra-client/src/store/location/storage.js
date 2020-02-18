import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const StorageRepo = RepositoryFactory.get('storage')
const DocRepo = RepositoryFactory.get('document')

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
    createStorage: async function({ commit, dispatch }, payload) {
      console.debug("%s: createStorage: Payload is: %O", __filename, payload)

      try {
        const response = await StorageRepo.createStorage(payload)
        commit("ADD_STORAGE", response.data)
        if (payload.attachments.length > 0) {
          await dispatch("attachDocumentsToStorage", { 
            attachments: payload.attachments,
            storage_uuid: response.data.uuid
          })
        }
      }
      catch (err) {
        console.error("%s: createStorage failed: %s", __filename, err)
      }
    },
    attachDocumentsToStorage: async function({ commit, dispatch }, payload) {
      console.debug("%s: attachDocumentsToStorage payload is: %O", __filename, payload)
      try {
        payload.attachments.forEach(async function (attachment) {
          console.debug("%s: Calling DocRepo.createAssociation with %O", __filename, attachment)
          const response = await DocRepo.createAssociation({
            attachment: attachment, // uuid of document
            target: payload.storage_uuid,
            type: "document"
          })
          console.debug("%s: DocRepo.createAssociation response: %O", __filename, response)
        })
        await dispatch("loadStorages")
      } 
      catch (err) {
        console.error("%s: attachDocumentsToStorage: %O", __filename, err)
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