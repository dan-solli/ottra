import Repository from "../repository";

const user_resource = "/user";
const auth_resource = "/auth";

export default {
	get() {
		return Repository.get(`${user_resource}`);
	},
	createUser(payload) {
		return Repository.post(`${auth_resource}`, payload);
	},
	authenticateUser(payload) {
		return Repository.post(`${auth_resource}/authenticate`, payload);
	},
	getSettings(uuid) {
		return Repository.get(`${user_resource}/${uuid}/settings`)
	}
};
