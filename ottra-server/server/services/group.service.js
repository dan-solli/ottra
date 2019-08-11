const GroupModel = require('./../models/group.model')
const UserService = require('./user.service')

const to = require('./../infra/await-to')

const GroupService = {
	getGroups: async function(user_id) {
		console.debug("%s: getGroups called with user_id: %s", __filename, user_id)
		return to(await GroupModel.getGroups(user_id))
	},
	createGroup: async function(payload, user_id) {
		console.debug("%s: createGroup called with payload: %O", __filename, payload)
		return to(await GroupModel.createGroup(payload, user_id))
	},
	inviteUsers: async function(payload, user_id) {
		console.debug("%s: inviteUsers called with userid: %s and payload: %O", __filename, user_id, payload)

		const group_id = payload.groupId
		const users_id = payload.userList.map(async function(u) {
			const [ user, ] = await to(UserService.getUserByName(u))
			if (user !== null) {
				return user.uuid
			} else {
				return null
			}
		}).filter(u => u !== null) 

		const responses = []

		users_id.forEach(async function(u) {
			responses.push(await to(GroupModel.inviteUser(group_id, user_id, u, payload.roleName )))
		})
		return responses
	}
}

module.exports = GroupService