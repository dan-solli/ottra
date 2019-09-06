import Vue from 'vue'
//import Vuex from 'vuex'

import JwtService from '@/common/jwt.service'
import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const UserRepo = RepositoryFactory.get('user')

const User = {
	state: {
    userid: '',
    userdata : {},
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
      JwtService.destroyTokens();
      state.isAuthenticated = false
      Vue.$log.debug("store.user.module.LOGOUT_USER: Removing Tokens, clearing variables")
    },
    SET_ACCESS_AUTH(state, token) {
      JwtService.saveToken(token);
      state.isAuthenticated = true
      Vue.$log.debug("store.user.module.SET_ACCESS_AUTH: setting isAuthenticated and saving JWTToken")
    },
    SET_REFRESH_AUTH(state, token) {
      JwtService.saveRefreshToken(token);
      Vue.$log.debug("store.user.module.SET_REFRESH_AUTH: saving refresh JWTToken")
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
    createNewUser: async function ({ commit, dispatch }, payload) {
      try {
        const response = await UserRepo.createUser(payload)
        Vue.$log.debug("store.user.module.createNewUser: ... Possible success ... ")
        Vue.$log.debug("store.user.module.createNewUser: Reponse is: ")
        Vue.$log.debug(response)
        const jwtAccessToken = response.data.accessToken
        const jwtRefreshToken = response.data.refreshToken
        commit("SET_ACCESS_AUTH", jwtAccessToken)
        commit("SET_REFRESH_AUTH", jwtRefreshToken)
        commit("SET_USER", response.data.uuid)
        console.log("Dispatching store.module.*.loadUserData")
        await dispatch("loadUserData")
        return response.data
      }
      catch (err) {
        Vue.$log.error("store.user.module.createNewUser: ... Definite failure ... " + err)
      }
    },
    getThisUser: async function ({ commit }) {
      try {
        const response = await UserRepo.get()

        console.debug("%s: getThisUser has %O", __filename, response)

        commit("SET_USERDATA", response.data)
        commit("SET_USER", response.data.uuid)
        return true
      }
      catch(err) {
        console.error("%s: getThisUser failed: %s", __filename, err)
        return false
      }
    },
    loadUserdata: async function ({ commit }, uuid) {
      try {
        //const response = await UserRepo.get()
        //commit("SET_USERDATA", response.data)
      }
      catch (err) {
        Vue.$log.error("store.user.module.loadUserdata: UserRepo.getUser failed: " + err)
      }
    },
    loginUser: async function ({ commit, dispatch }, payload) {
      Vue.$log.debug("store.user.module.loginUser is being called")

      try {
        const response = await UserRepo.authenticateUser(payload)
        Vue.$log.debug("store.user.module.loginUser: Response is: ")
        Vue.$log.debug(response)

        const jwtAccessToken = response.data.accessToken
        const jwtRefreshToken = response.data.refreshToken
        commit("SET_ACCESS_AUTH", jwtAccessToken)
        commit("SET_REFRESH_AUTH", jwtRefreshToken)
        commit("SET_USER", response.data.uuid)
        console.log("Dispatching store.module.*.loadUserData")
        await dispatch("loadUserData")
        return response.data
      }
      catch (err) {
        Vue.$log.error("store.user.module.loginUser: ... Definite failure ... " + err)
      }
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