import Vue from 'vue'


import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const DocumentRepo = RepositoryFactory.get('document')


const Document = {
	state: {
    documents: {
    }
	},
	mutations: {
    ADD_DOCUMENTS(state, response) {
      console.debug("%s.ADD_DOCUMENTS received response: %O", __filename, response)
      for (const result of response) {
        console.debug("%s.ADD_DOCUMENTS result is: %O", __filename, result)
        if (result.ok) {
          console.debug("%s.ADD_DOCUMENTS key is: %s, value is: %O", __filename, result.data.uuid, result.data)
          Vue.set(state.documents, result.data.uuid, result.data)
        }
      }
    },
    SET_DOCUMENTS(state, response) {
      state.documents = Object.assign({}, response)
    },
    CLEAR_STORE(state) {
      state.documents = {}
    }      
	},
	getters: {
    getDocuments: state => state.documents,
    getDocumentByID: (state) => (id) => { 
      return state.documents[id]
    },
	},
	actions: {
    uploadDocuments: async function ({ commit }, files) {
      const payload = new FormData()

      console.debug("%s: In Vuex, with files: %O", __filename, files)

      files.forEach(function(file) {
        console.debug("%s: In Vuex, appending %O to payload...", __filename, file)
        payload.append('documents', file)
      })      
      try {
        const response = await DocumentRepo.uploadDocuments(payload)
        commit("ADD_DOCUMENTS", response.data)
        return response.data
      }
      catch(err) {
        console.error("%s: File upload failed: %O", __filename, err)
      }
    },
    loadDocuments: async function ({ commit }) {
      try {
        const response = await DocumentRepo.get()
        console.debug("%s: loadUserData: Response is %O", __filename, response)

        let new_documents = {} 

        response.data.forEach(function(doc) {
          new_documents[doc.uuid] = doc
        })
        commit("SET_DOCUMENTS", new_documents)
      }
      catch (err) {
        console.error("MsgRepo failed to get messages")
      }      
    },
    loadUserData: async function({ dispatch }) {
      await dispatch("loadDocuments")
    },
    clearStore({ commit }) {
      commit("CLEAR_STORE")
    } 
	}
}

export default Document