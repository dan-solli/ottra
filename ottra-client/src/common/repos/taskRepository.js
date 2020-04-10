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
	updateTask(payload) {
		return Repository.put(`${resource}`, payload)
	},
	getTaskSteps(task_uuid) {
		return Repository.get(`${resource}/${task_uuid}/steps`)
	}
};
