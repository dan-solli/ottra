import Vue from 'vue'


import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const DocumentRepo = RepositoryFactory.get('document')
const FolderRepo = RepositoryFactory.get('folder')


const Document = {
	state: {
    documents: { },
    folderTree: { },
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
    },
    SET_FOLDER_TREE(state, tree) {
      tree.name = '/'
      state.folderTree = Object.assign({}, tree)
    },
	},
	getters: {
    getDocuments: state => state.documents,
    getDocumentByID: (state) => (id) => { 
      return state.documents[id]
    },
    getFolderTree: state => state.folderTree
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
        console.error("%s: DocumentRepo failed to get documents: %O", __filename, err)
      }      
    },
    createFolder: async function ({ commit, dispatch }, payload) {
      try {
        // TODO: Should validate that folderName only contains [A-Za-z0-9-_.]

        const response = await FolderRepo.createFolder(payload)
        console.debug("%s: createFolder: Response is %O", __filename, response)
        const response2 = await dispatch('getFolderTree')
      }
      catch (err) {
        console.error("%s: DocumentRepo failed to create folder: %O", __filename, err)
      }
    },
    moveFiles: async function ({ commit }, payload) {
      try {
        // const response = await DocumentRepo.moveFiles(payload)
        console.debug("%s: moveFiles: Response is %O", __filename, response)
      } catch (err) {
        console.error("%s: DocumentRepo failed to move files: %O", __filename, err)
      }
    },
    deleteFiles: async function ({ commit }, payload) {
      try {
        // const response = await DocumentRepo.moveFiles(payload)
        console.debug("%s: moveFiles: Response is %O", __filename, response)
      } catch (err) {
        console.error("%s: DocumentRepo failed to move files: %O", __filename, err)
      }
    },
    getFolderTree: async function({ commit }) {
      const response = await FolderRepo.getFolderTree()
      console.debug("%s: getFolderTree: Response is %O", __filename, response)
      commit("SET_FOLDER_TREE", response.data)
    },
    loadUserData: async function({ dispatch }) {
      await dispatch("loadDocuments")
      await dispatch("getFolderTree")
    },
    clearStore({ commit }) {
      commit("CLEAR_STORE")
    } 
	},
}

export default Document