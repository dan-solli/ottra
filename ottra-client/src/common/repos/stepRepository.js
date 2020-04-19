import Repository from "../repository";

const resource = "/step";

export default {
	get() {
		return Repository.get(`${resource}`)
	},
	createStep(payload) {
		return Repository.post(`${resource}`, payload)
	},
	deleteStep(step_uuid) {
		return Repository.delete(`${resource}`, { data: { uuid: step_uuid } } )
	},
	updateStep(payload) {
		return Repository.patch(`${resource}`, payload)
	},

	// New (WIP) here after:
	saveVisualAidImages(task_uuid, images) {
		return Repository.put(`${resource}/${task_uuid}/vai`, { vai: images})
	},
	saveTools(task_uuid, tools) {
		return Repository.put(`${resource}/${task_uuid}/tools`, { tools: tools })
	},
	saveAttachments(task_uuid, attachments) {
		return Repository.put(`${resource}/${task_uuid}/attachments`, { attachments: attachments })
	},
};
