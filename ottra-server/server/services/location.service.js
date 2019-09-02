const LocationModel = require('./../models/location.model')

const LocationService = {
	getLocations: async function(user_id) {
		// TODO: Check arguments.
		return await LocationModel.getLocations(user_id)
	},
	createLocation: async function(payload, user_id, files = 0) {
		// TODO: Check arguments.

		// Should Authorization happen here? Can I create a Location for another person?
		// Or is this just relevant for Rooms or Storage or other items which are children?

		return await LocationModel.createLocation(payload, user_id)
	}
		/* This is a rabbit hole.
			The file-references need to be stored in the database (so we can get their uuid)
			The files need to be copied to proper location (which is based on users id)

			But also, since I create the uuid myself, I basically can create the uuids out of turn
			and therefore pre-package the result. 

			I really should create the generic functionality for it right now, so it's there. I don't 
			really want to mull this over time after time. 

			Also, maybe the controller can appreciate that a file-upload is a file upload regardless of 
			what it may be bound to. Should I make it, as a UX nice gesture to upload files properly in 
			all cases where files could be uploaded and make the functionality generic to the degree
			I don't violate the dry principle?

		if (response.ok && files) {
			files.foreach(function(file) {
			  process.emit('attachDocument', file, response.data.uuid)
			}) 
		}
		// Should the item be re-fetched here, to include links to attachments, if any?
		// Or should the server refetch? Do we just create and damned be the return value?
		// What will VuexORM prefer, in case I stick with it?
		return [ response, null ]
	},
*/	
}

module.exports = {
	LocationService
}

// A service accepts one data object containing all relevant information.
// A service has to validate if the input received is enough to carry out its tasks.
// A service returns a promise which may or may not be rejected. 

// For POST, you just create something under your own name. No authorization required.
// For GET, you get all your locations. Should you get 

// HOW DO A FAMILY REUSE things?! How does the graph look?!
// How does the authorization work? 

// Should I just skip thinking of groups and authorization right now and get a silver bullet going?