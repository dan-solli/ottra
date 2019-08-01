import Vue from 'vue'
import Vuex from 'vuex'

const UserSettings = {
	state: {
		settings : {}
	},
	mutations: {
    ADD_OPTIONS(state, varval) {
      Object.assign(state.settings, varval)
    },
    CLEAR_STORE(state) {
      state.settings = {}
    }  
	},
	getters: {
  	getSettings: state => state.settings,
	},
	actions: {
    addOptions({ commit }, payload) {
      commit("ADD_OPTIONS", payload)
    },
    clearStore ({ commit }) {
      commit("CLEAR_STORE")
    }    
	}
}

export default UserSettings