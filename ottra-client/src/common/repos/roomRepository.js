import Repository from "../repository";

const room_resource = "/room";

export default {
	createRoom(payload) {
		return Repository.post(`${room_resource}`, payload);
	},
	// Should be path: /location/loc_uuid/rooms.
	getRoomsByLocation(location_uuid) {
		return Repository.get(`${room_resource}/location/${location_uuid}`)
	},
	getRooms() {
		return Repository.get(`${room_resource}`)
	},
	getRoom(room_uuid) {
		return Repository.get(`${room_resource}/${room_uuid}`)
	}
};
