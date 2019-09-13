const PlaceModel = require('./../models/place.model')

const PlaceService = {
	getPlaceByPlaceId: async function(place_id) {
		console.debug("%s: getPlaceByPlaceId called with %s", __filename, place_id)
		return await PlaceModel.getPlaceByPlaceId(place_id)
	},
	getPlaceByUUID: async function(place_uuid) {
		return await PlaceModel.getPlaceByCityId(place_uuid)
	},
	createPlace: async function(payload, user_id) {
		return await PlaceModel.createPlace(payload, user_id)
	}
}

module.exports = PlaceService

