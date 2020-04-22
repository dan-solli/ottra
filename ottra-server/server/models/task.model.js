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
						recurranceNumber: {recurranceNumber},
						recurranceType: {recurranceType},
						created: TIMESTAMP()
					}) RETURN t { .* } AS Task`, { 
						new_uuid: uuidv4(), 
						subject: payload.subject || 'No subject', 
						body: payload.body || 'No description',
						creator: user_id,
						recurranceNumber: payload.recurranceNumber, 
						recurranceType: payload.recurranceType
					}, "Task"
		)
	},
	getTasks: async function(uuid) {
		return await DB.fetchAll(`
			MATCH (:User { uuid: { uuid }})-[:HAS]->(t:Task)
			OPTIONAL MATCH (t)-[r:INCLUDES]->(s:Step)
			OPTIONAL MATCH (t)-[:GOODENOUGHIMAGE]->(dGE:Document)
			OPTIONAL MATCH (t)-[:GOALIMAGE]->(dG:Document)
			WITH t, s, r, 
					 COLLECT(dGE.uuid) AS GEI,
					 COLLECT(dG.uuid) AS GI
			ORDER BY r.order
			WITH COLLECT (s.uuid) as Steps, t, GEI, GI
			RETURN COLLECT (t { .*, 
								goodEnoughImages: GEI,
								goalImages: GI,
								steps: Steps, dateTime: apoc.date.format(t.created) }) AS Tasks`,
		{ uuid: uuid }, "Tasks")
	},
	getTask: async function(user_id, task_id) {
		return await DB.fetchAll(`
			MATCH (u:User { uuid: { user_id }})-[:HAS]->(t:Task { uuid: { task_id }})
			OPTIONAL MATCH (t)-[:GOODENOUGHIMAGE]->(dGE:Document)
			OPTIONAL MATCH (t)-[:GOALIMAGE]->(dG:Document)
			WITH t, 
					COLLECT(dGE.uuid) AS GEI,
					COLLECT(dG.uuid) AS GI
			RETURN t { .*, 
								goodEnoughImages: GEI,
								goalImages: GI,
								steps: [],
								dateTime: apoc.date.format(t.created) } AS Task`,
		{ user_id, task_id }, "Task")
	},

	// In use! 
	getSteps: async function(user_id, task_id) {
		return await DB.fetchAll(`
			MATCH (Task { uuid: { task_id }})-[r:INCLUDES]->(s:Step)
			WITH s, r ORDER BY r.order
			RETURN COLLECT(s.uuid) AS Steps`, { task_id }, "Steps"
		)
	},
	// In use!
	deleteTask: async function(user_id, task_uuid) {
    return await DB.fetchRow(`
      MATCH (t:Task { uuid: {task_uuid}, creator: {user_id} }) DETACH DELETE t`, 
      { user_id, task_uuid }
    )
	},
	updateTask: async function(user_id, payload) {
		console.debug("%s: updateTask called with payload: %O", __filename, payload)
		return await DB.fetchRow(`
			MATCH (t:Task { uuid: {uuid}, creator: {user_id} })
			SET t += {payload}
			RETURN t { .*, dateTime: apoc.date.format(t.created) } AS Task`, 
			{ uuid: payload.uuid, user_id, payload }, "Task"
		)
	},
}

module.exports = TaskModel