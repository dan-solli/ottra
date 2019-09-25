const { TODO_NEW } = require('./../infra/types/todo.types')

const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const TodoModel = {
	createTodo: async function(user_id, payload) {
		const { 
			status = TODO_NEW,
			subject = 'No subject',
			body = 'Empty message', 
			priority = -1,
			softDeadline = -1,
			hardDeadline = -1,
		} = payload

		return await DB.fetchRow(`
	MATCH (u:User { uuid: {creator} })					
	CREATE (u)-[:HAS]->(t:Todo { 
						uuid: {new_uuid}, 
						status: {status}, 
						subject: {subject}, 
						body: {body},
						priority: {priority}, 
						softDeadline: {softDeadline},
						hardDeadline: {hardDeadline},
						creator: {creator},
						created: TIMESTAMP()
					}) return t { .* } as Todo`, { 
						new_uuid: uuidv4(), 
						status: status,
						subject: subject,
						body: body,
						priority: priority,
						softDeadline: softDeadline,
						hardDeadline: hardDeadline,
						creator: user_id
					}, "Todo"
		)
	},
	getTodos: async function(uuid) {
		return await DB.fetchAll(`
	MATCH (:User { uuid: { uuid }})-[r:HAS]->(t:Todo)
	RETURN COLLECT (t { .*, dateTime: apoc.date.format(t.sent), relType: TYPE(r) }) AS Todos`,
		{ uuid: uuid }, "Todos")
	},
	deleteTodo: async function(user_id, todo_uuid) {
    return await DB.fetchRow(`
      MATCH (t:Todo { uuid: {todo_uuid}, creator: {user_id} }) DETACH DELETE t`, 
      { user_id, todo_uuid }
    )
	}
}

module.exports = TodoModel