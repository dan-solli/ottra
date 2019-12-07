import Vue from 'vue'

const UIFileBrowser = {
  state: {
    selected_files: [],
    current_working_dir: '/',
  },
  getters: {
    getSelectedFiles: state => state.selected_files,
    getCurrentWorkingDirectory: state => state.current_working_dir
  },
  actions: {
    setCurrentWorkingDir: function({ commit }, cwd) {
      commit("SAVE_CWD", cwd)
    },
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
      return Promise.all([ 
        dispatch('clearSelectedFiles'),
        dispatch('setCurrentWorkingDir', '/'),
      ])
    },
  },
  mutations: {
    SAVE_CWD(state, cwd) {
      state.current_working_dir = cwd
    },
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
      state.current_working_dir = []
    },
  }
};

export default UIFileBrowser
