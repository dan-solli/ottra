const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const StepModel = {
	createStep: async function(user_id, parent_uuid, payload) {
		console.debug("%s: createStep got payload: %O", __filename, payload)
		const maxStepResult = await StepModel.getMaxStep(parent_uuid)
		console.debug("%s: createStep maxStepResult is: %O", __filename, maxStepResult)
		let maxStep = 1

		if (maxStepResult.ok && maxStepResult.data === null) {
			maxStep = 1
		} else if (maxStepResult.ok) {
			maxStep = maxStepResult.data
		} else {
			return maxStepResult
		}

		const newStepNumber = maxStep + 1

		return await DB.fetchRow(`
			MATCH (t { uuid: {parent_uuid}})
			CREATE (t)-[:INCLUDE { order: {order} }]->(s:Step {
				uuid: {uuid},
				created: TIMESTAMP(),
				creator: {creator},
				type: {step_type},
				description: {description}
			}) RETURN s { .*, dateTime: apoc.date.format(s.created) } AS Step`,
			{ 
				uuid: uuidv4(),
				creator: user_id,
				step_type: payload.type || 'step',
				description: payload.text,
				order: newStepNumber,
				parent_uuid: parent_uuid
			}, "Step"
		)
	},
	getSteps: async function(uuid) {
	},
	deleteStep: async function(user_id, step_uuid) {
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
	getMaxStep: async function(todo_id) {
		return await DB.fetchRow(`
			MATCH (t { uuid: {todo_id} })-[r:INCLUDE]->(s:Step)
			WITH t, MAX(r.order) as max_order
			RETURN max_order AS Max`, { todo_id }, "Max"
		)
	}
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