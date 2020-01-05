import Repository from "../repository"

const resource = "/folders"

export default {
	createFolder(payload) {
		return Repository.post(`${resource}`, payload)
	},
	deleteFolder(payload) {
		return Repository.delete(`${resource}`, { data: { payload: payload }})
	},
	moveFolder(payload) {
		return Repository.patch(`${resource}`, payload)
	},
	getFolderTree() {
		return Repository.get(`${resource}`)
	}
}
