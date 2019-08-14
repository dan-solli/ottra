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
      Vue.$log.info("In Group Mutation: This is what we should add.")
      Vue.$log.info(payload)
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
        Vue.$log.debug("store.group.createGroup: ... Possible success ... ")
        Vue.$log.debug("store.group.createGroup: Reponse is: ")
        Vue.$log.debug(response)
        commit("ADD_GROUP", response.data)
      }
      catch (err) {
          Vue.$log.error("store.group.createGroup: ... Definite failure ... " + err)
      }
    },
    loadUserData: async function({ commit }) {
      try {
        const response = await GroupRepo.get()
        Vue.$log.debug("store.group.loadUserData: Response is: %O", response)

        let new_groups = {} 

        response.data.forEach(function(grp) {
          new_groups[grp.uuid] = grp
        })
        commit("SET_GROUP", new_groups)
      }        
      catch (err) {
        Vue.$log.error("store.group.module.loadUserData")
      }
    }
	}
}

export default Group