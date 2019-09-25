import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
import { TODO_NEW } from '@/common/todo.types'

const TodoRepo = RepositoryFactory.get('todo')

const Todo = {
	state: {
		todos: {
		}
	},
	getters: {
		getTodos: state => state.todos,
		getUnattendedNewTodos: state => Object.values(state.todos).filter(function(todo) {
			if (todo.status === TODO_NEW) {
				return todo
			} else {
				return null
			}
		})
	},
	mutations: {
		SET_TODOS(state, payload) {
			state.todos = Object.assign({}, payload)
		},
		CLEAR_STORE(state) {
			state.todos = {}
		},
		REMOVE_TODO(state, uuid) {
			Vue.delete(state.todos, uuid)
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
		deleteTodo: async function({ commit }, todo_uuid) {
			try {
				console.debug("%s: deleteTodo, payload is: %O", __filename, todo_uuid)
				const response = await TodoRepo.deleteTodo(todo_uuid)
				commit("REMOVE_TODO", todo_uuid)
				return response.data
			} 
			catch(err) {
				console.error("%s: deleteTodo failed: %O", __filename, err)
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