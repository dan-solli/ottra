import Vue from 'vue'

// Highly suspicious. I think this should be stored in the component. I see very little reason
// to share this information with the rest of the app. You select a bunch of files to remove, move
// or use/tie to an object. All of which is in the component. 
//
// Or. Hmm, selected files has to be emitted to parent in case of selecting files for attachment,
// and then, it is probably several files. Emit that, or just keep it centralized? 
// For that case, I think I prefer Vuex. 
const UIFileBrowser = {
  state: {
    selected_files: {},
  },
  getters: {
    getSelectedFiles: state => state.selected_files,
    getSelectedFilesById: (state) => (id) => {
      return state.selected_files[id]
    }
  },
  actions: {
    addSelectedFile: function({ commit }, { id, file} ) {
      commit("ADD_SELECTED_FILES", id, file)
    },
    removeSelectedFile: function({ commit }, { id, file }) {
      commit("REMOVE_SELECTED_FILES", id, file)
    },
    clearSelectedFiles: function({ commit }, id) {
      commit("CLEAR_SELECTED_FILES", id)
    },
/*    
    clearItems: function({ dispatch }) {
      return dispatch('clearSelectedFiles')
    },
*/    
  },
  mutations: {
    ADD_SELECTED_FILES(state, id, file) {
      const fileList = state.selected_files[id] || []
      fileList.push(file)
      Vue.set(state.selected_files, id, fileList)
    },
    REMOVE_SELECTED_FILES(state, id, file) {
      const fileList = state.selected_files[id] || []
      fileList = fileList.filter(function(f) {
        if (f != file) {
          return f 
        }
      })
      Vue.set(state.selected_files, id, fileList) 
    },
    CLEAR_SELECTED_FILES(state, id) {
      Vue.set(state.selected_files, id, [])
    },
  }
};

export default UIFileBrowser
