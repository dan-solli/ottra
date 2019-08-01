import Vue from 'vue'
import Vuex from 'vuex'

import JwtService from '@/common/jwt.service'
import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const UserRepo = RepositoryFactory.get('user')

const User = {
	state: {
    userid: '',
		userdata : {
    },
    isAuthenticated: !!JwtService.getToken()
	},
	mutations: {
		SET_USER(state, userid) {
      Vue.$log.debug("store.user.module.SET_USER: setting userid: " + userid)
  		state.userid = userid
  	},
    SET_USERDATA(state, userdata) {
      state.userdata = userdata
    },
    LOGOUT_USER(state) {
      JwtService.destroyToken();
      state.isAuthenticated = false
      Vue.$log.debug("store.user.module.LOGOUT_USER: Removing Token, clearing variables")
    },
    SET_AUTH(state, token) {
      JwtService.saveToken(token);
      state.isAuthenticated = true
      Vue.$log.debug("store.user.module.SET_AUTH: setting isAuthenticated and saving JWTToken")
    },
    CLEAR_STORE(state) {
      state.userdata = {},
      state.userid = '',
      state.isAuthenticated = false
    }    
	},
	getters: {
  	getUser: state => state.userdata,
    getUserID: state => state.userid,
    isAuthenticated: state => state.isAuthenticated
	},
	actions: {
    createNewUser ({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        return UserRepo.createUser(payload)
        .then(function(response) {
          Vue.$log.debug("store.user.module.createNewUser: ... Possible success ... ")
          Vue.$log.debug("store.user.module.createNewUser: Reponse is: ")
          Vue.$log.debug(response)
          const jwtToken = response.data.token
          commit("SET_AUTH", jwtToken)
          commit("SET_USER", response.data.id)
          console.log("Dispatching store.module.*.loadUserData")
          dispatch("loadUserData")
          .then(resolve())
          .catch(reject())
          resolve(response.data)
        })
        .catch(function(err) {
          Vue.$log.error("store.user.module.createNewUser: ... Definite failure ... " + err)
          reject(err)
        })
      })
    },    
    loadUserdata ({ commit }, uuid) {
      UserRepo.getUser(uuid)
      .then(function(response) {
        commit("SET_USERDATA", response.data)
      })
      .catch(function(err) {
        Vue.$log.error("store.user.module.loadUserdata: UserRepo.getUser failed: " + err)
      })
    },
    loginUser ({ commit, dispatch }, payload) {
      Vue.$log.debug("store.user.module.loginUser is being called")

      return new Promise((resolve, reject) => {
        return UserRepo.authenticateUser(payload)
        .then(function(response) {
          Vue.$log.debug("store.user.module.loginUser: Response is: ")
          Vue.$log.debug(response)

          const jwtToken = response.data.token
          commit("SET_AUTH", jwtToken)
          commit("SET_USER", response.data.id)
          console.log("Dispatching store.module.*.loadUserData")
          dispatch("loadUserData")
          .then(resolve())
          .catch(reject())
          resolve(response.data)
        })
        .catch(function(err) {
          Vue.$log.error("store.user.module.loginUser: ... Definite failure ... " + err)
          reject(err)
        })
      })
    },
    logoutUser ({ commit, dispatch }) {
      Vue.$log.debug("store.user.index.js: logoutUser has been called.")
      commit("LOGOUT_USER")
      dispatch("clearStore")
    },
    clearStore ({ commit }) {
      commit("CLEAR_STORE")
    }
	}
}

export default User