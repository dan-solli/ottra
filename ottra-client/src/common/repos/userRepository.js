import Repository from "../repository";

const user_resource = "/user";
const auth_resource = "/auth";
const settings_resource = user_resource + "/settings"

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
	getSettings() {
		return Repository.get(`${settings_resource}`)
	},
};
