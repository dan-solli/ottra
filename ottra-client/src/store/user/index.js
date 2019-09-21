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
      console.debug("%s: SET_USER setting userid: %s", __filename, userid)
      state.userid = userid
    },
    SET_USERDATA(state, userdata) {
      state.userdata = userdata
    },
    LOGOUT_USER(state) {
      JwtService.destroyTokens();
      state.isAuthenticated = false
      console.debug("%s: LOGOUT_USER Removing Tokens, clearing variables", __filename)
    },
    SET_ACCESS_AUTH(state, token) {
      JwtService.saveToken(token);
      state.isAuthenticated = true
      console.debug("%s: SET_ACCESS_AUTH: setting isAuthenticated and saving JWTToken", __filename)
    },
    SET_REFRESH_AUTH(state, token) {
      JwtService.saveRefreshToken(token);
      console.debug("%s: SET_REFRESH_AUTH: saving refresh JWTToken", __filename)
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
        console.debug("%s: createNewUser: ... Possible success ... ", __filename)
        console.debug("%s: createNewUser: Reponse is: %O", __filename, response)
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
        console.error("%s: createNewUser: ... Definite failure: %s", __filename, err)
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
        console.error("%s: loadUserdata: UserRepo.getUser failed: %s", __filename, err)
      }
    },
    loginUser: async function ({ commit, dispatch }, payload) {
      console.debug("%s: loginUser is being called", __filename)

      try {
        const response = await UserRepo.authenticateUser(payload)
        console.debug("%s: loginUser: Response is: %O", __filename, response)

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
        console.error("%s: loginUser: ... Definite failure: %s", __filename, err)
      }
    },
    logoutUser ({ commit, dispatch }) {
      console.debug("%s: logoutUser has been called.", __filename)
      commit("LOGOUT_USER")
      dispatch("clearStore")
    },
    clearStore ({ commit }) {
      commit("CLEAR_STORE")
    }
	}
}

export default User