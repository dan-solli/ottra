import Repository from "../repository";

const resource = "/step";

export default {
	get() {
		return Repository.get(`${resource}`)
	},
	getStep(step_uuid) {
		return Repository.get(`${resource}/${step_uuid}`)
	},
	createStep(payload) {
		return Repository.post(`${resource}`, payload)
	},
	deleteStep(step_uuid) {
		return Repository.delete(`${resource}`, { data: { uuid: step_uuid } } )
	},
	updateStep(payload) {
		return Repository.put(`${resource}`, payload)
	},

	// New (WIP) here after:
	saveVisualAidImages(step_uuid, images) {
		return Repository.put(`${resource}/${step_uuid}/vai`, { vai: images})
	},
	saveTools(step_uuid, tools) {
		return Repository.put(`${resource}/${step_uuid}/tools`, { tools: tools })
	},
	saveAttachments(step_uuid, attachments) {
		return Repository.put(`${resource}/${step_uuid}/attachments`, { attachments: attachments })
	},
};
