const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const StepModel = {
	createStep: async function(user_id, payload) {
		console.debug("%s: createStep got payload: %O", __filename, payload)

		return await DB.fetchRow(`
			CREATE(s:Step {
				uuid: {uuid},
				created: TIMESTAMP(),
				creator: {creator}
			})
			SET s += { payload }
			RETURN s { .*, dateTime: apoc.date.format(s.created) } AS Step`,
			{
				uuid: payload.uuid,
				creator: user_id,
				payload: payload
			}, "Step"
		)
	},

	getSteps: async function(user_id) {
		return await DB.fetchAll(`
			MATCH (s:Step { creator: {user_id} })
			RETURN COLLECT (s { .*, dateTime: apoc.date.format(s.created) }) AS Steps`,
			{ user_id }, "Steps"
		)
	},
	deleteStep: async function(user_id, step_uuid) {
		return await DB.fetchRow(`
			MATCH (t)-[r:INCLUDE]->(s:Step { uuid: {step_uuid} }) DETACH DELETE s`,
			{ step_uuid })
	},
	updateStep: async function(user_id, payload) {
		return await DB.fetchRow(`
			MATCH (s:Step { uuid: {uuid}, creator: {user_id} })
			SET s += {payload}
			RETURN s { .*, dateTime: apoc.date.format(s.created) } AS Step`, 
			{ uuid: payload.uuid, user_id, payload }, "Step"
		)
	},
	getStepsById: async function(todo_id) {
		return await DB.fetchAll(`
			MATCH (t { uuid: { todo_id }})-[r:INCLUDES]->(s:Step)
			ORDER BY r.order
			RETURN s { .*, dateTime: apoc.date.format(s.created) } AS Steps`,
			{ todo_id }, "Steps"
		)
	},
}

module.exports = StepModel

/*
 *  Get all tasks with sorted step lists.

MATCH (s:Step)<-[r:EXECUTES]-(t:Task) 
WITH s, t, r ORDER BY r.order
WITH COLLECT (s { .*, order: r.order  }) AS Steps, t 
RETURN COLLECT (t { .*, steps: Steps }) AS Tasks

 * Finding max order-number for each task

MATCH (s:Step)<-[r:EXECUTES]-(t:Task)
WITH t, MAX(r.order) as max
RETURN COLLECT (t { .uuid, max: max }) 


*/