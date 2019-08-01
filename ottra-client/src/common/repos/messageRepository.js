import Repository from "../repository";

const resource = "/message";

export default {
	get() {
		return Repository.get(`${resource}`);
	}
};
