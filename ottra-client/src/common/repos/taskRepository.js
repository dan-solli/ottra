import Repository from "../repository";

const resource = "/task";

export default {
	get() {
		return Repository.get(`${resource}`)
	},
	createTask(payload) {
		return Repository.post(`${resource}`, payload)
	},
	deleteTask(task_uuid) {
		return Repository.delete(`${resource}`, { data: { uuid: task_uuid } } )
	},
	updateTask(payload) { // Should be changed to patch.
		return Repository.put(`${resource}`, payload)
	},
	getTaskSteps(task_uuid) {
		return Repository.get(`${resource}/${task_uuid}/steps`)
	},

	// New (WIP) ones here after:
	saveStepList(task_uuid, steps) {
		return Repository.put(`${resource}/${task_uuid}/steps`, steps)
	},
	saveGoalImages(task_uuid, images) {
		return Repository.put(`${resource}/${task_uuid}/gi`, { images: images })
	},
	saveGoodEnoughImages(task_uuid, images) {
		return Repository.put(`${resource}/${task_uuid}/gei`, { images: images })
	},

};
