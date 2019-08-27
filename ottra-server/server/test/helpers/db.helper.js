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

function deleteUserByName(username) {
	const session = Connection.session()

	//console.debug("Deleting existing user NOW!")
	return session.run(`MATCH (u:User { username: {username} }) DETACH DELETE u`, { username: username })
	.then(function(result) {
		// Foo 
	})
	.catch(function(err) {
		throw new Error(err)
	}) 
	.finally(function() {
		//console.debug("Deletion done! Closing Session NOW!")
		session.close()
	})

}

function closeDatabaseConnection() {
	//console.debug("Closing database connection NOW!")
	return Promise.resolve(Connection.close())
}

module.exports = {
	deleteUserByName,
	closeDatabaseConnection
}
