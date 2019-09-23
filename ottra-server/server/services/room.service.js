const RoomModel = require('./../models/room.model')

const RoomService = {
	getRoomsByLocation: async function(location_id, user_id) {
		// TODO: Check arguments.
		return await RoomModel.getRoomsByLocation(location_id, user_id)
	},
	createRoom: async function(payload, user_id) {
		try {
			const createRoomResult = await RoomModel.createRoom(payload, user_id)
			return await RoomModel.getRoomById(user_id, createRoomResult.data.uuid)
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	},
	getRooms: async function(user_id) {
		return await RoomModel.getRooms(user_id)
	},
	getRoomById: async function(user_id, room_id) {
		return await RoomModel.getRoomById(user_id, room_id)
	}
}

module.exports = RoomService
