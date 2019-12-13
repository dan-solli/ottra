import Repository from "../repository"

const resource = "/document"

export default {
	uploadDocuments(payload) {
		console.debug("%s: In repo, with payload %O", __filename, payload)
		return Repository.post(`${resource}`, payload)
	},
	get() {
		return Repository.get(`${resource}`)
	},
	createFolder(payload) {
		return Repository.post(`${resource}/folder`, payload)
	},
	moveFiles(payload) {
		return Repository.patch(`${resource}/folder`, payload)
	},
	deleteFiles(payload) {
		return Repository.delete('`${resource}', { data: { payload: payload }})
	},
	getFolderTree() {
		return Repository.get(`${resource}/folder`)
	}
}
