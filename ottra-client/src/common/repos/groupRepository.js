import Repository from "../repository";

const resource = "/group";

export default {
	get() {
		return Repository.get(`${resource}`);
	},
	createGroup(payload) {
		return Repository.post(`${resource}`, payload);
	},
};
