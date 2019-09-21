import Vue from 'vue'
//import Vuex from 'vuex'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const GroupRepo = RepositoryFactory.get('group')

const Group = {
	state: {
    groups : {
    },
	},
	mutations: {
    SET_GROUP(state, payload) {
      state.groups = Object.assign({}, payload)
    },
    ADD_GROUP(state, payload) {
      console.info("%s: ADD_GROUP: This is what we should add: %O", __filename, payload)
      state.groups[payload.uuid] = payload
    }
	},
	getters: {
    getGroups: state => state.groups,
    getGroupByID: (state) => (id) => { 
      return state.groups[id]
    },
	},
	actions: {
    createGroup: async function({ commit }, payload)
    {
      try {
        const response = await GroupRepo.createGroup(payload)
        console.debug("%s: createGroup: Response is %O", __filename, response)
        commit("ADD_GROUP", response.data)
      }
      catch (err) {
        console.error("%s: createGroup: Fail: %s", __filename, err)
      }
    },
    loadUserData: async function({ commit }) {
      try {
        const response = await GroupRepo.get()
        console.debug("%s: loadUserData: Response is: %O", response)

        let new_groups = {} 

        response.data.forEach(function(grp) {
          new_groups[grp.uuid] = grp
        })
        commit("SET_GROUP", new_groups)
      }        
      catch (err) {
        console.error("%s: loadUserData failed: %s", __filename, err)
      }
    }
	}
}

export default Group