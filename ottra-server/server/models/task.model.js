const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const TaskModel = {
	createTask: async function(user_id, payload) {
		return await DB.fetchRow(`
	MATCH (u:User { uuid: {creator} })					
	CREATE (u)-[:HAS]->(t:Task { 
						uuid: {new_uuid}, 
						subject: {subject}, 
						body: {body},
						creator: {creator},
						recurranceEvery: {recurranceEvery},
						recurranceType: {recurranceType},
						created: TIMESTAMP()
					}) RETURN t { .* } AS Task`, { 
						new_uuid: uuidv4(), 
						subject: payload.subject || 'No subject', 
						body: payload.body || 'No description',
						creator: user_id,
						recurranceEvery: payload.recurranceEvery, 
						recurranceType: payload.recurranceType
					}, "Task"
		)
	},
	getTasks: async function(uuid) {
		return await DB.fetchAll(`
			MATCH (:User { uuid: { uuid }})-[:HAS]->(t:Task)
			OPTIONAL MATCH (t)-[r:INCLUDE]->(s:Step)
			WITH t, s, r ORDER BY r.order
			WITH COLLECT (s.uuid) as Steps, t
			RETURN COLLECT (t { .*, steps: Steps, dateTime: apoc.date.format(t.created) }) AS Tasks`,
		{ uuid: uuid }, "Tasks")
	},
	deleteTask: async function(user_id, task_uuid) {
    return await DB.fetchRow(`
      MATCH (t:Task { uuid: {task_uuid}, creator: {user_id} }) DETACH DELETE t`, 
      { user_id, task_uuid }
    )
	},
	updateTask: async function(user_id, payload) {
		if (payload.hasOwnProperty('steps')) {
			delete payload.steps
		}

		console.debug("%s: updateTask called with payload: %O", __filename, payload)
		return await DB.fetchRow(`
			MATCH (t:Task { uuid: {uuid}, creator: {user_id} })
			SET t += {payload}
			RETURN t { .*, dateTime: apoc.date.format(t.created) } AS Task`, 
			{ uuid: payload.uuid, user_id, payload }, "Task"
		)
	}
}

module.exports = TaskModel