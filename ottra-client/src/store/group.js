import Vue from 'vue'
import Vuex from 'vuex'

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
    createGroup({ commit }, payload)
    {
      return new Promise((resolve, reject) => {
        return GroupRepo.createGroup(payload)
        .then(function(response) {
          Vue.$log.debug("store.group.createGroup: ... Possible success ... ")
          Vue.$log.debug("store.group.createGroup: Reponse is: ")
          Vue.$log.debug(response)
          commit("ADD_GROUP", response.data)
          resolve(response.data)          
        })
        .catch(function(err) {
          Vue.$log.error("store.group.createGroup: ... Definite failure ... " + err)
          reject(err)
        })
      })
    },
    loadUserData({ commit }) {
      return new Promise((resolve, reject) => {
        return GroupRepo.get()
        .then(function(response) {
          console.log("store.group.loadUserData: Response is: ")
          console.log(response)

          let new_groups = {} 

          response.data.forEach(function(grp) {
            new_msg[grp.uuid] = grp
          })
          commit("SET_GROUP", new_groups)
          resolve(response.data)
        })
        .catch(function(err) {
          Vue.$log.error("store.group.module.loadUserData")
          reject(err)
        })
      })
    }
	}
}

export default Message