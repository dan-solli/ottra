import Repository from "../repository";

const resource = "/step";

export default {
/*	
	get() {
		return Repository.get(`${resource}`)
	},
*/	
	createStep(payload) {
		return Repository.post(`${resource}`, payload)
	},
/*	
	deleteTodo(todo_uuid) {
		return Repository.delete(`${resource}`, { data: { uuid: todo_uuid } } )
	},
	updateTodo(payload) {
		return Repository.put(`${resource}`, payload)
	}
*/	
};
