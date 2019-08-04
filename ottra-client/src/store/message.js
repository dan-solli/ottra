import Vue from 'vue'
import Vuex from 'vuex'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const MsgRepo = RepositoryFactory.get('message')

const Message = {
	state: {
    messages : {
    },
    message_types: {
      "system#usertodo#general-settings": {
        route: 'settings',
        directive: 'tab-general',
        text: '(*) Set up settings now',
        typeText: '(*) Todo'
      },
      "system#usertodo#profile-settings": {
        route: 'settings',
        directive: 'tab-profile',
        text: '(*) Set up your profile now',
        typeText: '(*) Todo'
      },
      "system#usertodo#createlocation": {
        route: 'location',
        directive: 'new-directive',
        text: '(*) Create your home now',
        typeText: '(*) Todo'
      },
      "system#usertodo#creategroup": {
        route: 'group',
        directive: 'new-directive',
        text: '(*) Create a group now',
        typeText: '(*) Todo'
      }
    }
	},
	mutations: {
    SET_MESSAGES(state, payload) {
      state.messages = Object.assign({}, payload)
    },
    CLEAR_STORE(state) {
      state.messages = {}
    }      
	},
	getters: {
  	getMessages: state => state.messages,
    getMessageTypes: state => state.message_types,
    getMessageCount: state => Object.keys(state.messages).length,
    getMessageByID: (state) => (id) => { 
      return state.messages[id]
    },
    getMessagesUnread: (state) => {
      console.log("State.messages is: ")
      console.log(state.messages)
      return Object.values(state.messages).filter(x => x.status === "unread")
    },
    getMessageUnreadCount: (state, getters) => getters.getMessagesUnread.length
	},
	actions: {
    createMessage({ commit }, msgID)
    {

    },
    loadUserData({ commit }) {
      return new Promise((resolve, reject) => {
        return MsgRepo.get()
        .then(function(response) {
          console.log("store.message.loadUserData: Response is: ")
          console.log(response)

          let new_msg = {} 

          response.data.forEach(function(msg) {
            new_msg[msg.uuid] = msg
          })
          commit("SET_MESSAGES", new_msg)
          resolve(response.data)
        })
        .catch(function(err) {
          Vue.$log.error("store.message.module.loadUserData")
          reject(err)
        })
      })
    },
    clearStore({ commit }) {
      commit("CLEAR_STORE")
    }
	}
}

export default Message