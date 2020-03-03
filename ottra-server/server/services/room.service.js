const RoomModel = require('./../models/room.model')
const LocationModel = require('./../models/location.model')

const RoomService = {
	getRoomsByLocation: async function(location_id, user_id) {
		// TODO: Check arguments.
		return await RoomModel.getRoomsByLocation(location_id, user_id)
	},
	createRoom: async function(payload, user_id) {
		try {
			const accessEquipment = payload.accessEquipment
			delete payload.accessEquipment

			const createRoomResult = await RoomModel.createRoom(payload, user_id)

			accessEquipment.forEach(async function (eq_uuid) {
				await LocationModel.createAccessKey(createRoomResult.data.uuid, eq_uuid)
			})

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
