import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
const UserRepo = RepositoryFactory.get('user')

const UserSettings = {
	state: {
		settings : {

    }
	},
	mutations: {
    SET_OPTIONS(state, varval) {
      Object.assign(state.settings, varval)
    },
    ADD_OPTION(state, option, value) {
      Vue.set(state.settings, option, value)
    },
    REMOVE_OPTION(state, option) {
      Vue.delete(state.settings, option)
    },
    CLEAR_STORE(state) {
      state.settings = {}
    }  
	},
	getters: {
    getSettings: state => state.settings,
	},
	actions: {
    loadUserSettings: async function ({ commit }) {
      try {
        const response = await UserRepo.getSettings()
        console.debug("%s: loadUserSettings: Response is %O", __filename, response)

        let new_settings = {} 

        response.data.forEach(function(doc) {
          new_settings[doc.uuid] = doc
        })
        commit("SET_OPTIONS", new_settings)
      }
      catch (err) {
        console.error("UserRepo failed to get settings")
      }      
    },
    loadUserData: async function({ dispatch }) {
      //await dispatch("loadUserSettings")
    },
    clearStore ({ commit }) {
      commit("CLEAR_STORE")
    }    
	}
}

export default UserSettings