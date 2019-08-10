const GroupModel = require('./../models/group.model')

const GroupService = {
	getGroups: async function(user_id) {
		console.debug("%s: getGroups called with user_id: %s", __filename, user_id)

		const response = await GroupModel.getGroups(user_id)
		return [ response, null ]
	},
	createGroup: async function(payload) {
		console.debug("%s: createGroup called with payload: %O", __filename, payload)

		// TODO: I think there's a huge refactoring requiring try/catch everywhere...
		const response = await GroupModel.createGroup(payload)
		// TODO: I think this belongs in the model, where it is actually created.


		// TODO: Seriously, what piece of code is reponsible for what here? 
		// It is not a part of the Group Complex either way. You invite A USER to A GROUP. 
		// It's not a group inviting users. 
		if (payload.invitees.length) {
			payload.invitees.forEach(function(invitee) {
				const invitation = await GroupModel.inviteUser(invitee, response.uuid, payload)
				process.emit('inviteUser', { invited: invitee, inviter: response.uuid, })
			})
		}
		return [ response, null ]
	}
}

module.exports = GroupService