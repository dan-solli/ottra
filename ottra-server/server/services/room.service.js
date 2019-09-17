const RoomModel = require('./../models/room.model')

const RoomService = {
	getRoomsByLocation: async function(location_id, user_id) {
		// TODO: Check arguments.
		return await RoomModel.getRoomsByLocation(location_id, user_id)
	},
	createRoom: async function(payload, user_id) {
		try {
			createRoomResult = await RoomModel.createRoom(payload, user_id)
			console.debug("%s: createRoom returning: %O", __filename, createRoomResult)
			return createRoomResult
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	},
	getRooms: async function(user_id) {
		return await RoomModel.getRooms(user_id)
	}
}

module.exports = RoomService
