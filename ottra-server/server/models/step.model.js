const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const StepModel = {
	// In use
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
				uuid: uuidv4(),
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
	// In use
	getStepById: async function(user_id, step_id) {
		console.debug("%s: getStepById called with id: %s", __filename, step_id)
		return await DB.fetchRow(`
			MATCH (s:Step { uuid: { step_id }})
			RETURN s { .* } AS Step`, { step_id }, "Step")
	},
	// In use
	getVisualAidImages: async function(step_id) {
		const result = await DB.fetchAll(`
			MATCH (s:Step { uuid: { step_id }})-[:VISUALAID]->(d:Document)
			RETURN COLLECT(d.uuid) AS Images`, { step_id }, "Images")
		console.debug("%s: getVisualAidImages will return: %O", __filename, result)
		return result
	},
	// In use
	getTools: async function(step_id) {
		const result = await DB.fetchAll(`
			MATCH (s:Step { uuid: { step_id }})-[:REQUIRES]->(e:Equipment)
			RETURN COLLECT(e.uuid) AS Tools`, { step_id }, "Tools")
		console.debug("%s: getTools will return: %O", __filename, result)
		return result
	},
	// In use 
	getAttachments: async function(step_id) {
		const result = await DB.fetchAll(`
			MATCH (s:Step { uuid: { step_id }})-[:ATTACHMENT]->(d:Document)
			RETURN COLLECT(d.uuid) AS Attachments`, { step_id }, "Attachments")
		console.debug("%s: getAttachments will return: %O", __filename, result)
		return result
	},
}

/* 	getTask: async function(user_id, task_id) {
		return await DB.fetchAll(`
			MATCH (:User { uuid: { user_id }})-[:HAS]->(t:Task { uuid: { task_id }})
			OPTIONAL MATCH (t)-[r:INCLUDE]->(s:Step)
			OPTIONAL MATCH (t)-[:ATTACHMENT { type: 'goodEnoughImage'}]->(dGE:Document)
			OPTIONAL MATCH (t)-[:ATTACHMENT { type: 'goalImage'}]->(dG:Document)
			WITH t, r, 
					 COLLECT(dGE.uuid) AS GEI,
					 COLLECT(dG.uuid) AS GI
					 COLLECT(s { .*}) AS Steps
			ORDER BY r.order
			RETURN COLLECT (t { .*, 
								goodEnoughImages: GEI,
								goalImages: GI,
								steps: Steps, dateTime: apoc.date.format(t.created) }) AS Tasks`,
		{ user_id, task_id }, "Task")
	},
*/

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