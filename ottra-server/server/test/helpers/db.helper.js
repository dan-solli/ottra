const result = require('dotenv').config({ path: '/home/dsi/projects/ottra/ottra-server/server/.env' })
if (result.error) {
	console.error("Failed to parse configuration file")
}

const Neo4J = require('neo4j-driver').v1
const Connection = Neo4J.driver(process.env.NEO4J_URL, 
																Neo4J.auth.basic(process.env.NEO4J_USERNAME, 
																								process.env.NEO4J_PASSWORD), {
																	disableLosslessIntegers: true
																}
															)

function clearTestData() {
	const session = Connection.session()

	session.run(`MATCH (u:User { username: {username} }) DETACH DELETE u`, 
		{ username: 'testsson@test.se' })
	.then(function() {
		return true
	})
	.catch(function(err) {
		console.error("%s: Cleaning users in test failed. %s", __filename, err)
	})
	session.run(` MATCH (g:Group { name: {groupname} })	DETACH DELETE g`, 
		{ groupname: 'Groupname01' })
	.then(function() {
		Connection.close()
		return true
	})
	.catch(function(err) {
		console.error("%s: Cleaning groups in test failed. %s", __filename, err)
	})
}

module.exports = {
	clearTestData,
}
