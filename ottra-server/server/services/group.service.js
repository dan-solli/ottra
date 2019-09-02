const GroupModel = require('./../models/group.model')
const UserService = require('./user.service')

const GroupService = {
	getGroups: async function(user_id) {
		// TODO: Check arguments.
		return await GroupModel.getGroups(user_id)
	},
	createGroup: async function(payload, user_id) {
		// TODO: Check arguments.
		return await GroupModel.createGroup(payload, user_id)
	},
	inviteUsers: async function(payload, user_id) {
		// TODO: Check arguments.
		const group_id = payload.groupId
		const users_id = payload.userList.map(async function(u) {
			const { ok, data } = await UserService.getUserByName(u)
			if (ok) {
				return data.uuid
			} else {
				return null
			}
		}).filter(u => u !== null) 

		const responses = []

		users_id.forEach(async function(u) {
			responses.push(await GroupModel.inviteUser(group_id, user_id, u, payload.roleName))
		})
		return responses
	}
}

module.exports = GroupService