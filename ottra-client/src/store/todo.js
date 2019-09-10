import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const TodoRepo = RepositoryFactory.get('todo')

const Todo = {
	state: {
		todos: {
		}
	},
	getters: {
		getTodos: state => state.todos,
	},
	mutations: {
		SET_TODOS(state, payload) {
			state.todos = Object.assign({}, payload)
		},
		CLEAR_STORE(state) {
			state.todos = {}
		},
		ADD_TODO(state, payload) {
      Vue.set(state.todos, payload.uuid, payload)			
		}
	},
	actions: {
		saveTodo: async function({ commit }, payload) {
			try {
				console.debug("%s: saveTodo, payload is: %O", __filename, payload)
				const response = await TodoRepo.createTodo(payload)
				commit("ADD_TODO", response.data)
				return response.data
			} 
			catch(err) {
				console.error("%s: saveTodo failed: %O", __filename, err)
			}
		},
		loadTodos: async function({ commit })	{
			try {
				const response = await TodoRepo.get()
				console.debug("%s: loadTodos: Response is %O", __filename, response)

				let new_todos = {}

				response.data.forEach(function(todo) {
					new_todos[todo.uuid] = todo
				})
				commit("SET_TODOS", new_todos)
			}
			catch(err) {
				console.error("%s: loadTodos failed: %O", __filename, err)
			}
		},
		loadUserData: async function({ dispatch }) {
			await dispatch("loadTodos")
		},
		clearStore({ commit }) {
			commit("CLEAR_STORE")
		}

	},
}

export default Todo