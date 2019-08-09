const Neo4J = require('neo4j-driver').v1

const Connection = Neo4J.driver(process.env.NEO4J_URL, 
																Neo4J.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD), {
																	disableLosslessIntegers: true
																}
															)

const Database = {
	run: async function(cypher, payload, gettable = null) {
		let session = Connection.session()

		//console.debug("%s: run called with:\n%s\nAnd payload:\n%O", __filename, cypher, payload)
		try {
			const result = await session.run(cypher, payload)
			if (gettable !== null) {
				console.debug("%s: run result (%s): %O", __filename, gettable, result.records[0].get(gettable))
				return result.records[0].get(gettable)
			} else {
				return result.records
			}
		}
		catch (err) {
			console.error("%s: run failed: %s", __filename, err)
		}
		finally {
			session.close()
		}
	}
}

module.exports = Database