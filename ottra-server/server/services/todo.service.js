const TodoModel = require('./../models/todo.model')

const TodoService = {
	getTodos: async function(user_id) {
		if (!user_id) {
			return { ok: false, error: { code: 404, status: 'failed', message: 'No such user' }}
		}	else {
			return await TodoModel.getTodos(user_id)
		}
	},
	createTodo: async function(user_id, payload) {
		try {
			const result = await TodoModel.createTodo(user_id, payload)
			return result
		}
		catch (err) {
			return { ok: false, error: err }
		}
	},
	deleteTodo: async function(user_id, todo_uuid) {
		return await TodoModel.deleteTodo(user_id, todo_uuid)
	},
	updateTodo: async function(user_id, payload) {
		const updateTodoResult = await TodoModel.updateTodo(user_id, payload)
		return updateTodoResult
	}
}

module.exports = TodoService