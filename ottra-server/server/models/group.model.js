const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const GroupModel = {
	createGroup: async function(payload, user_id) {
		console.debug("%s: createGroup is called with payload: %O", __filename, payload)

		const result = await DB.fetchRow(`
			MATCH (u:User { uuid : {creator} })
			CREATE (u)-[:BELONG_TO { role: 'admin' } ]->(g:Group {
				uuid: {uuid},
				creator: {creator},
				created: TIMESTAMP(),
				name: {group_name} 
			}) RETURN g { .* } AS Group`, { 
				uuid: uuidv4(),
				creator: user_id, 
				group_name: payload.groupName,
			}, "Group"
		)
		console.debug("%s: createGroup creation result is: %O", __filename, result)
		return result
	},
	getGroups: async function(user_id) {
		console.debug("%s: getGroups is called with user_id: %s", __filename, user_id)

		const result = await DB.fetchAll(`
			MATCH (:User { uuid: {uuid}})-[:BELONG_TO]->(g:Group)
			RETURN COLLECT (g { .* }) AS Groups`, { 
				uuid: user_id 
			}, "Groups")

		console.debug("%s: getGroups db-fetch returns: %O", __filename, result)

		if (result.length == 0) {
			console.debug("%s: getGroups found no matches for %s", __filename, user_id)
			return 0
		}
		return result		
	},
	inviteUser: async function({ group_id, inviter_uuid, invited_uuid, role_name }) {
		// Yes, one at the time. 
		console.debug("%s: inviteUser is called: %s is inviting %s to group %s",
			inviter_uuid, invited_uuid, group_id)
		const result = await DB.run(`
			MATCH (g:Group { uuid : {group_id} }), (i:User { uuid: {invited_uuid} })
			CREATE (g)-[:INVITE { inviter: {inviter_uuid}, role: {roleName} }]->(i)`, { 
				group_id: group_id,
				invited_uuid: invited_uuid,
				inviter_uuid: inviter_uuid,
				roleName: role_name
			}
		)
		return result
	}
}

module.exports = GroupModel