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
    selected_files: [],
  },
  getters: {
    getSelectedFiles: state => state.selected_files,
  },
  actions: {
    addSelectedFile: function({ commit }, file) {
      commit("ADD_SELECTED_FILES", file)
    },
    removeSelectedFile: function({ commit }, file) {
      commit("REMOVE_SELECTED_FILES", file)
    },
    clearSelectedFiles: function({ commit }) {
      commit("CLEAR_SELECTED_FILES")
    },
    clearItems: function({ dispatch }) {
      return dispatch('clearSelectedFiles')
    },
  },
  mutations: {
    ADD_SELECTED_FILES(state, file) {
      state.selected_files.push(file)
    },
    REMOVE_SELECTED_FILES(state, file) {
      state.selected_files = state.selected_files.filter(function(f) {
        if (f != file) {
          return f 
        }
      }) 
    },
    CLEAR_SELECTED_FILES(state) {
      state.selected_files = []
    },
  }
};

export default UIFileBrowser
