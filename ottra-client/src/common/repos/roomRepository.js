import Repository from "../repository";

const room_resource = "/room";

export default {
	createRoom(payload) {
		return Repository.post(`${room_resource}`, payload);
	},
	getRoomsByLocation(location_uuid) {
		return Repository.get(`${room_resource}/location/${location_uuid}`)
	},
	getRooms() {
		return Repository.get(`${room_resource}`)
	}
};
