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
      console.debug("%s: SET_STORAGES: %O", __filename, payload)
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
    },
    getStorageTreeNodeById: (state, getters) => (id) => {
      const node = state.storages[id]

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
        type: "storage",
        icon: "mdi-package-variant",
        children: childNodes,
        parent: { ...node.location }
      }
    },
    getStorageAutoCompleteNodeById: (state) => (id) => {
      const node = state.storages[id]
      return {
        text: node.name,
        value: node.uuid,
        parent: { ...node.location }
      }
    },
    getStorageParent: (state, getters) => (id) => {
      const node = state.storages[id]
      if (node.location.type[0] === "storage") {
        return getters.getStorageByID(id)
      } else if (node.location.type[0] === "room") {
        return getters.getRoomByID(id)
      }
      return null
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
    fetchStorage: async function({ commit, dispatch, state }, 
      { storage_uuid, force_fetch = false, force_hydrate = false }) {
      console.debug("%s: fetchStorage uuid: %s", _filename, storage_uuid)

      try {
        if (!force_fetch) {
          console.debug("%s: fetchStorage, not forced!", __filename)
          if (state.storages.hasOwnProperty(storage_uuid)) {
            console.debug("%s: fetchStorage - had info in state", __filename)
            return state.storages[storage_uuid]
          } else {
            console.debug("%s: fetchStorage - data not found in state. Should fetch from backend.", __filename)
            force_fetch = true
          }
        }
        if (force_fetch) {
          console.debug("%s: fetchStorage - fetching from backend", __filename)
          const response = await StorageRepo.getStorage(storage_uuid)
          console.debug("%s: StorageRepo.getStorage returns %O", __filename, response.data)
          commit("ADD_STORAGE", response.data)
          await dispatch("hydrateStorage", response.data.uuid)
          return response.data
        } else {
          console.error("%s: fetchStorage: Dunno why we ended up here...")
        }
      }
      catch (err) {
        console.error("%s: fetchStorage failed: %s", __filename, err)
      }
    },
    hydrateStorage: async function({ state, dispatch }, storage_uuid) {
      console.debug("%s: Trying to hydrate storage: %s", __filename, storage_uuid)
      if (!storage_uuid || !state.storages.hasOwnProperty(storage_uuid)) {
        console.error("%s: hydrateStorage cannot find room %s", __filename, storage_uuid)
      } else {
        const storage = state.storages[storage_uuid]
        if (storage.hasOwnProperty("visualAidImages") && storage.visualAidImages.length > 0) {
          console.debug("%s: hydrateStorage - hydrating visualAidImages", __filename)
          await Promise.all(storage.visualAidImages.map(async function (doc) {
            await dispatch("fetchDocument", { doc_uuid: doc })
          }))
        }
        if (storage.hasOwnProperty("attachments") && storage.attachments.length > 0) {
          console.debug("%s: hydrateStorage - hydrating attachments", __filename)
          await Promise.all(storage.attachments.map(async function (doc) {
            await dispatch("fetchDocument", { doc_uuid: doc })
          }))
        }
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