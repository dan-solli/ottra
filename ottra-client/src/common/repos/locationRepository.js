import Repository from "../repository";

const loc_resource = "/location";
const geo_resource = "/geography";

export default {
/*
	get(userid) {
		return Repository.get(`/user/${userid}${loc_resource}s`);
	},
	getLocation(uuid) {
		return Repository.get(`${loc_resource}/${uuid}`);
	},
	getRooms(locationId) {
		return Repository.get(`${loc_resource}/${locationId}/rooms`)
	},
	getStorage(roomId) {
		return Repository.get(`${loc_resource}/room/${roomId}/storages`)
	},
*/	
	createLocation(payload) {
		return Repository.post(`${loc_resource}`, payload);
	},
	searchLocation(str) {
		return Repository.get(`${geo_resource}/search/${str}`)
	},
	findPlace(place_id) {
		return Repository.get(`${geo_resource}/place/${place_id}`)
	}
};
