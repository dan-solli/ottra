const DB = require('./../infra/db')

const GroupModel = {
	getGroups: async function(user_id) {
		console.debug("%s: getGroups is called with user_id: %s", __filename, user_id)

		const result = await DB.run(`
			MATCH (:User { uuid: {uuid}})-[:BELONG_TO]->(g:Group)
			RETURN COLLECT (g { .* }) AS Groups
		`, { uuid: user_id }, "Groups")

		console.debug("%s: getGroups db-fetch returns: %O", __filename, result)

		if (result.length == 0) {
			console.debug("%s: getGroups found no matches for %s", __filename, user_id)
			return 0
		}
		return result		
	},
	createGroup: async function(payload) {
		console.debug("%s: createUser is called with payload: %O", __filename, payload)

		const result = await DB.run(`
			MATCH (u:User { uuid : {creator} })
			CREATE (u)-[:BELONG_TO]->(g:Group {
				creator: {creator},
				created: TIMESTAMP(),
				name: {group_name} 
			}) return id(g) as internalGroupID`, { creator: req.tokenData.id, group_name: groupName })
		const tmpID = result.records[0].get('internalGroupID')
		const response = await DB.run(`
			MATCH (g:Group) WHERE id(g) = { id } 
			RETURN COLLECT (g { .* } as Group`, { id: tmpID }, "Group")
		return response[0]
	}
}

module.exports = GroupModel