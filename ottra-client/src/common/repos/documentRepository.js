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
}
