const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const GroupModel = {
	createGroup: async function(payload, user_id) {
		return await DB.fetchRow(`
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
	},
	getGroups: async function(user_id) {
		return await DB.fetchAll(`
			MATCH (:User { uuid: {uuid}})-[:BELONG_TO]->(g:Group)
			RETURN COLLECT (g { .* }) AS Groups`, { 
				uuid: user_id 
			}, "Groups")
	},
	inviteUser: async function({ group_id, inviter_uuid, invited_uuid, role_name }) {
		// Yes, one at the time. 
		return await DB.run(`
			MATCH (g:Group { uuid : {group_id} }), (i:User { uuid: {invited_uuid} })
			CREATE (g)-[:INVITE { inviter: {inviter_uuid}, role: {roleName} }]->(i)`, { 
				group_id: group_id,
				invited_uuid: invited_uuid,
				inviter_uuid: inviter_uuid,
				roleName: role_name
			}
		)
	}
}

module.exports = GroupModel