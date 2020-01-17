import Repository from "../repository"

const resource = "/document"


// TODO: Make sure all paths are being encoded before being sent to server. 
// This will probably be handled here and in Vuex. But I wonder if it should all be handled 
// right here. Or in the Vuex getter. But. No. I don't know.

// It should be done in Vuex. 
export default {
	get() {
		return this.getDocuments({ cwd: "/" })
	},
	uploadDocuments(payload) {
		console.debug("%s: In repo, with payload %O", __filename, payload)
		return Repository.post(`${resource}`, payload)
	},
	deleteDocument(payload) {
		return Repository.delete(`${resource}`, { data: { payload: payload }})
	},
	moveDocument(payload) {
		return Repository.patch(`${resource}`, payload)
	},
	dissociateDocument(payload) {
		return Repository.delete(`${resource}/association`, payload)
	},
	changeDocumentAssociation(payload) {
		return Repository.patch(`${resource}/association`, payload)
	},
	getDocumentsByCwd(payload) {
		const cwd = payload.cwd
		if (cwd.length < 1) {
			cwd = "/"
		}
		const cwdEncoded = encodeURIComponent(payload.cwd)
		return Repository.get(`${resource}?path=${cwdEncoded}`)
	},
	getDocuments(payload) {
		return Repository.get(`${resource}`)
	},
	getDocument(payload) { // Should be rewritten not to use query param.
		return Repository.get(`${resource}?document=${payload.uuid}`)
	},
	getAssociationsTo(payload) {
		return Repository.get(`${resource}/association?source=${payload.uuid}`)
	},
	getAssociationsFrom(payload) {
		return Repository.get(`${resource}/association?target=${payload.uuid}`)
	},
	createAssociation(payload) {
		return Repository.post(`${resource}/association`, payload)
	}


}
