import Vue from 'vue'

const Promises = {
	state: { 
		promiseState: { },
		promiseListState: { }
	},
	mutations: {
		ADD_PROMISE(state, { type, uuid, status }) {
			Vue.set(promiseState, type[uuid], status)
		}
		ADD_PROMISE_FOR_LIST(state, { type, status }) {
			Vue.set(promiseState, type, status)
		}
	},
	actions: {
		setPromise: async function ({ commit }, { type, uuid, status = true }) {
			console.debug("%s: setPromise called with type: %s, uuid: %s, status: %s",
				__filename, type, uuid, status)
			commit("ADD_PROMISE", { type, uuid, status })
		},
		setPromiseForList: async function ({ commit }, { type, status = true }) {
			console.debug("%s: setPromiseForList called with type: %s, status: %s",
				__filename, type, status)
			commit("ADD_PROMISE_FOR_LIST", { type, status })
		},
	},
}

export default Promises