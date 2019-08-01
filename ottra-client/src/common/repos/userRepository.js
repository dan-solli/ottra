import Repository from "../repository";

const resource = "/user";

export default {
	get() {
		return Repository.get(`${resource}`);
	},
	getUser(uuid) {
		return Repository.get(`${resource}/${uuid}`);
	},
	createUser(payload) {
		return Repository.post(`${resource}`, payload);
	},
	authenticateUser(payload) {
		return Repository.post(`${resource}/authenticate`, payload);
	},
	getSettings(uuid) {
		return Repository.get(`${resource}/${uuid}/settings`)
	}
};
