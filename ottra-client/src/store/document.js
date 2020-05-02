import Vue from 'vue'


import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const DocumentRepo = RepositoryFactory.get('document')
const FolderRepo = RepositoryFactory.get('folder')

const Document = {
	state: {
    //documents: { },
    current_working_directory: '/',
    folders: {}, 
    folderTree: { },
	},
	mutations: {
    SET_FOLDERS(state, tree) {
      state.folders = Object.assign({}, tree)      
    },
    CLEAR_STORE(state) {
      state.documents = {}
    },
    SET_FOLDER_TREE(state, tree) {
      tree.name = '/'
      state.folderTree = Object.assign({}, tree)
    },
    SET_CWD(state, cwd) {
      while (cwd.search("//") > -1) {
        cwd = cwd.replace("//", "/")
      }      
      state.current_working_directory = cwd || "/"
    }
	},
	getters: {
    getDocuments: state => state.folders[state.current_working_directory],
    getFolderTree: state => state.folderTree,
    getCWD: state => state.current_working_directory,
    findFileByUUID: (state) => (doc_uuid) => {
      for (const dirname of Object.keys(state.folders)) {
        for (const dirent of state.folders[dirname]) {
          if (dirent.type === 'file' && dirent.uuid === doc_uuid) {
            return dirent
          }
        }
      }
    },
    getServerPath: state => "https://192.168.1.200:8888/content",      
	},
	actions: {
    changeDir: async function ({ commit, state }, cwd) {
      if (cwd === '..') {
        const dirParts = state.current_working_directory.split("/")
        dirParts.pop()
        cwd = "/" + dirParts.join("/")
      }
      commit("SET_CWD", cwd)
    },
    uploadDocuments: async function ({ commit, dispatch, state }, files) {
      const payload = new FormData()

      payload.append('cwd', state.current_working_directory)
      console.debug("%s: In Vuex, with files: %O", __filename, files)

      files.forEach(function(file) {
        console.debug("%s: In Vuex, appending %O to payload...", __filename, file)
        payload.append('documents', file)
      })      
      try {
        const response = await DocumentRepo.uploadDocuments(payload)
        await dispatch("loadDocuments")
      }
      catch(err) {
        console.error("%s: File upload failed: %O", __filename, err)
      }
    },
    loadDocuments: async function ({ commit }) {
      try {
        const response = await DocumentRepo.get()
        console.debug("%s: loadDocuments: Response is %O", __filename, response)

        commit("SET_FOLDERS", response.data)
      }
      catch (err) {
        console.error("%s: DocumentRepo failed to get documents: %O", __filename, err)
      }      
    },
    fetchDocument: async function({ dispatch }, { doc_uuid, force_fetch = false }) {
/*      
      console.debug("%s: fetchDocument is called with %s", __filename, doc_uuid)
      try {
        const response = await DocumentRepo.getDocument(doc_uuid)
        console.debug("%s: fetchDocument: Response is: %O", __filename, response.data)
      }
      //dispatch("loadDocuments")
*/      
    },
    createFolder: async function ({ commit, dispatch, state }, folderName) {
      try {
        // TODO: Should validate that folderName only contains [A-Za-z0-9-_.]

        const response = await FolderRepo.createFolder({ 
                                cwd: state.current_working_directory,
                                folderName: folderName
                              })
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
    deleteFiles: async function ({ commit, dispatch, state, getters }, payload) {
/*
      function findFileByUUID(doc_uuid) {
        for (const dirname of Object.keys(state.folders)) {
          for (const dirent of state.folders[dirname]) {
            if (dirent.type === 'file' && dirent.uuid === doc_uuid) {
              return dirent
            }
          }
        }
      }
*/
      console.debug("%s: deleteFiles called with %O", __filename, payload)
      if (Array.isArray(payload)) {
        try {
          const result = payload.map(async function(doc_uuid) {
            const dirent = await getters.findFileByUUID(doc_uuid)
            if (dirent !== "undefined") {
              console.debug("%s: Dirent is: %O", __filename, dirent)
              const payload = {
                uuid: doc_uuid,
                path: dirent.path,
                file: dirent.filename
              }
              const retval = await DocumentRepo.deleteDocument(payload)
              await dispatch("removeSelectedFile", doc_uuid)
              await dispatch("loadDocuments")
              await dispatch("getFolderTree")

              return retval
            } else {
              console.error("Ok, we're trying to delete a file which has been lost. WTF.")
              throw "Fuck shit crap"
            }
          })
          console.debug("%s: deleteFiles: Response is %O", __filename, result)
        } catch (err) {
          console.error("%s: DocumentRepo failed to delete files: %O", __filename, err)
        }
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