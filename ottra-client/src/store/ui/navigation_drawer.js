//import Vue from 'vue'
//import Vuex from 'vuex'

const UIState = {
  state: {
    sidebar_default_items: [
      { 
        title: '(*) Dashboard', // $t('ui.navigation_drawer.title.home'), 
        route: '/dashboard',
        icon: 'dashboard'
      }
    ],
    sidebar_mode_items: [
      {
        title: '(*) Project',
        route: '/create/project',
        icon: 'work'
      },
      {
        title: '(*) Task',
        route: '/create/task',
        icon: 'playlist_add'
      }
    ],
    sidebar_view_items: [
      {
        title: '(*) Link project to schedule',
        route: '/create/project/link',
        icon: 'link'
      }
    ],
    sidebar_extra_items: [
      {
        title: '(*) Mail project outline',
        route: '/create/project/mail',
        icon: 'mail'
      }
    ],
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
    setModeItems({ commit }, items) {
      return new Promise((resolve) => {
        commit("saveModeItems", items)
        resolve()
      })
    },
    setViewItems({ commit }, items) {
      return new Promise((resolve) => {
        commit("saveViewItems", items)
        resolve()
      })
    },
    setExtraItems({ commit }, items) {
      return new Promise((resolve) => {
        commit("saveExtraItems", items)
        resolve()
      })
    },
    clearItems({ dispatch }) {
      return Promise.all([ 
        dispatch('setModeItems', []),
        dispatch('setViewItems', []),
        dispatch('setExtraItems', [])
      ])
    },
    setMode({ commit }, mode) {
      return new Promise((resolve) => {
        commit("saveMode", mode)
        resolve()
      })
    },
    setView({ commit }, view) {
      return new Promise((resolve) => {
        commit("saveView", view)
        resolve()
      })
    }  
  },
  mutations: {
    saveModeItems({ state, data }) {
      state.sidebar_mode_items = data
    },
    saveViewItems({ state, data }) {
      state.sidebar_view_items = data
    },
    saveExtraItems({ state, data }) {
      state.sidebar_view_items = data
    },
    saveMode({ state, data }) {
      state.sidebar_mode_items = data
    },
    saveView({ state, data }) {
      state.sidebar_view_items = data
    }
  }
};

export default UIState
