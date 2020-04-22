const DB = require('./../infra/db')

const uuidv4 = require('uuid/v4')

const CommonModel = {
	createRelation: async function(src, dest, label, props) {
		return await DB.fetchRow(`
			MATCH (src { uuid: { src } }), (dest { uuid: { dest } })
			CREATE (src)-[r:${label} { props }]->(dest)
			RETURN r AS Rel
		`, { src, dest, props }, "Rel" )
	},	
	removeRelation: async function(src, dest) {
		return await DB.fetchRow(`
			MATCH (src { uuid: { src }})-[r]->(dest { uuid: { dest }}) DELETE r RETURN r as Rel`,
			{ src, dest }, "Rel")
	}
}

module.exports = CommonModel