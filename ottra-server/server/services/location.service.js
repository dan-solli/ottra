const LocationModel = require('./../models/location.model')

const to = require('./../infra/await-to')

const LocationService = {
	getLocations: async function(user_id) {
		console.debug("%s: getLocations called with user_id: %s", __filename, user_id)
		return LocationModel.getLocations(user_id)
	},
	createLocation: async function(payload, user_id) {
		console.debug("%s: createLocation called with payload: %O", __filename, payload)

		// Should Authorization happen here? Can I create a Location for another person?
		// Or is this just relevant for Rooms or Storage or other items which are children?

		const response = await LocationModel.createLocation(payload, user_id)

		// Handle attachments/documents/images here
		console.debug("%s: createLocation will return: %O", __filename, response)

		// Should the item be re-fetched here, to include links to attachments, if any?
		// Or should the server refetch? Do we just create and damned be the return value?
		// What will VuexORM prefer, in case I stick with it?
		return [ response, null ]
	},
}

module.exports = LocationService

// A service accepts one data object containing all relevant information.
// A service has to validate if the input received is enough to carry out its tasks.
// A service returns a promise which may or may not be rejected. 