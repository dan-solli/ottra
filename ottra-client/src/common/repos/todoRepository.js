import Repository from "../repository";

const resource = "/todo";

export default {
	get() {
		return Repository.get(`${resource}`)
	},
	createTodo(payload) {
		return Repository.post(`${resource}`, payload)
	}
};
