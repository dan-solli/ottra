const LocationModel = require('./../models/location.model')

const to = require('./../infra/await-to')

const LocationService = {
	getLocations: async function(user_id) {
		console.debug("%s: getLocations called with user_id: %s", __filename, user_id)
		return to(await LocationModel.getLocations(user_id))
	},
	createLocation: async function(payload, user_id) {
		console.debug("%s: createLocation called with payload: %O", __filename, payload)
		const response = await LocationModel.createLocation(payload, user_id)
		console.debug("%s: createLocation will return: %O", __filename, response)
		return [ response, null ]
	},
}

module.exports = LocationService

