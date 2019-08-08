const Neo4J = require('neo4j-driver').v1

const Connection = Neo4J.driver(process.env.NEO4J_URL, 
																Neo4J.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD), {
																	disableLosslessIntegers: true
																}
															)

const Database = {
	run: async function(cypher, payload) {
		let session = Connection.session()
		let returnValue = null

		try {
			const result = await session.run(cypher, payload)
			session.close()

			returnValue = result.records
		} 
		catch (err) {
			console.error(err)
		}
		finally {
			session.close()
			return returnValue
		}
	}
}

module.exports = Database