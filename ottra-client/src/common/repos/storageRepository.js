import Repository from "../repository";

const storage_resource = "/storage";

export default {
	createStorage(payload) {
		return Repository.post(`${storage_resource}`, payload);
	},
	getStorages() {
		return Repository.get(`${storage_resource}`)
	}
};
