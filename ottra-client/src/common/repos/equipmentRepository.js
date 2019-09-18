import Repository from "../repository";

const equipment_resource = "/equipment";

export default {
	createEquipment(payload) {
		return Repository.post(`${equipment_resource}`, payload);
	},
	get() {
		return Repository.get(`${equipment_resource}`)
	}
};
