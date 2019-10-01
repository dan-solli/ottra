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
			softDLDate = -1,
			hardDLDate = -1,
			softDLTime = -1,
			hardDLTime = -1,
		} = payload

		return await DB.fetchRow(`
	MATCH (u:User { uuid: {creator} })					
	CREATE (u)-[:HAS]->(t:Todo { 
						uuid: {new_uuid}, 
						status: {status}, 
						subject: {subject}, 
						body: {body},
						priority: {priority}, 
						softDeadlineDate: {softDLDate},
						softDeadlineTime: {softDLTime},
						hardDeadlineDate: {hardDLDate},
						hardDeadlineTime: {hardDLTime},
						creator: {creator},
						created: TIMESTAMP()
					}) RETURN t { .* } AS Todo`, { 
						new_uuid: uuidv4(), 
						status, subject, body, priority,
						softDLDate, hardDLDate, softDLTime, hardDLTime,
						creator: user_id
					}, "Todo"
		)
	},
	getTodos: async function(uuid) {
		return await DB.fetchAll(`
	MATCH (:User { uuid: { uuid }})-[:HAS]->(t:Todo)
	RETURN COLLECT (t { .*, dateTime: apoc.date.format(t.created) }) AS Todos`,
		{ uuid: uuid }, "Todos")
	},
	deleteTodo: async function(user_id, todo_uuid) {
    return await DB.fetchRow(`
      MATCH (t:Todo { uuid: {todo_uuid}, creator: {user_id} }) DETACH DELETE t`, 
      { user_id, todo_uuid }
    )
	},
	updateTodo: async function(user_id, payload) {
		if (payload.hasOwnProperty('steps')) {
			delete payload.steps
		}

		console.debug("%s: updateTodo called with payload: %O", __filename, payload)
		return await DB.fetchRow(`
			MATCH (t:Todo { uuid: {uuid}, creator: {user_id} })
			SET t += {payload}
			RETURN t { .*, dateTime: apoc.date.format(t.created) } AS Todo`, 
			{ uuid: payload.uuid, user_id, payload }, "Todo"
		)
	}
}

module.exports = TodoModel