import Vue from 'vue'
//import Vuex from 'vuex'

const UIState = {
  state: {
    sidebar_default_items: [],
    sidebar_mode_items: [],
    sidebar_view_items: [],
    sidebar_extra_items: [],
    current_mode: "No Mode",
    current_view: "Start"
  },
  getters: {
    getNavigationDrawerItems: (state) => {
      return [
        state.sidebar_default_items || [],
        state.sidebar_mode_items || [],
        state.sidebar_view_items || [],
        state.sidebar_extra_items || []
      ]
    },
    getCurrentMode: state => state.current_mode,
    getCurrentView: state => state.current_view
  },
  actions: {
    setDefaultItems: function({ commit }, items) {
      commit("saveDefaultItems", items)
    },
    setModeItems: function({ commit }, items) {
      commit("saveModeItems", items)
    },
    setViewItems: function({ commit }, items) {
      commit("saveViewItems", items)
    },
    setExtraItems: function({ commit }, items) {
      commit("saveExtraItems", items)
    },
    clearItems: function({ dispatch }) {
      return Promise.all([ 
        dispatch('setModeItems', []),
        dispatch('setViewItems', []),
        dispatch('setExtraItems', [])
      ])
    },
    setMode: function({ commit }, mode) {
      commit("saveMode", mode)
    },
    setView: function({ commit }, view) {
      commit("saveView", view)
    }  
  },
  mutations: {
    saveDefaultItems(state, data) {
      state.sidebar_default_items = data
    },
    saveModeItems(state, data) {
      state.sidebar_mode_items = data
    },
    saveViewItems(state , data) {
      state.sidebar_view_items = data
    },
    saveExtraItems(state, data) {
      state.sidebar_view_items = data
    },
    saveMode(state, data) {
      state.sidebar_mode_items = data
    },
    saveView(state, data) {
      state.sidebar_view_items = data
    }
  }
};

export default UIState
