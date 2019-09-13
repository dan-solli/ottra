import Vue from 'vue'

import { APPMODE_GENERAL } from '@/common/appmode.types'

const UIState = {
  state: {
    sidebar_default_items: [],
    sidebar_mode_items: [],
    sidebar_view_items: [],
    sidebar_extra_items: [],
    current_mode: APPMODE_GENERAL,
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
      commit("SAVE_DEFAULT_ITEMS", items)
    },
    setModeItems: function({ commit }, items) {
      commit("SAVE_MODE_ITEMS", items)
    },
    setViewItems: function({ commit }, items) {
      commit("SAVE_VIEW_ITEMS", items)
    },
    setExtraItems: function({ commit }, items) {
      commit("SAVE_EXTRA_ITEMS", items)
    },
    clearItems: function({ dispatch }) {
      return Promise.all([ 
        dispatch('setModeItems', []),
        dispatch('setViewItems', []),
        dispatch('setExtraItems', [])
      ])
    },
    setMode: function({ commit }, mode) {
      commit("SAVE_MODE", mode)
    },
    setView: function({ commit }, view) {
      commit("SAVE_VIEW", view)
    }  
  },
  mutations: {
    SAVE_DEFAULT_ITEMS(state, data) {
      state.sidebar_default_items = data
    },
    SAVE_MODE_ITEMS(state, data) {
      state.sidebar_mode_items = data
    },
    SAVE_VIEW_ITEMS(state, data) {
      state.sidebar_view_items = data
    },
    SAVE_EXTRA_ITEMS(state, data) {
      state.sidebar_extra_items = data
    },
    SAVE_MODE(state, data) {
      state.current_mode = data
    },
    SAVE_VIEW(state, data) {
      state.current_view = data
    }
  }
};

export default UIState
