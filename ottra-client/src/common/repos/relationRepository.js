import Repository from "../repository"

const resource = "/relation"

export default {
	createRelation(payload) {
		return Repository.post(`${resource}`, payload)
	}
}
