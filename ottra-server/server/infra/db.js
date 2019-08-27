const Neo4J = require('neo4j-driver').v1

const Connection = Neo4J.driver(process.env.NEO4J_URL, 
																Neo4J.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD), {
																	disableLosslessIntegers: true
																}
															)

const Database = {
	run: async function(cypher, payload, gettable = null) {
		let session = Connection.session()

		console.warn("%s: Function 'run' is deprecated. Please replace!", __filename)
//		console.debug("%s: run called with (%s, %O, %s)", __filename, cypher, payload, gettable)
		try {
			const result = await session.run(cypher, payload)
			//console.debug("%s: run result (%s): %O", __filename, gettable, result)
			console.debug("%s: run result.records[0].get(%s): %O", __filename, gettable, result.records[0].get(gettable))
			//console.debug("%s: run: For kicks, what is result.record.length? => %s", __filename, result.records.length)
			//console.debug("%s: run: For more kicks, what is result.record[0].get(%s)? => %O", 
			//	__filename, 
			//	gettable,
			//	result.records[0].get(gettable))

			console.debug("%s: Desperation! \n%s", 
				__filename, 
				JSON.stringify((result.records[0].get(gettable))[0]))

			return (result.records[0].get(gettable))[0]
		}
		catch (err) {
			console.error("%s: run failed: %s", __filename, err)
		}
		finally {
			session.close()
		}
	},
	fetchRow: async function(cypher, payload, gettable) {
		const result = await Database.fetchRaw(cypher, payload)
		//console.debug("%s: fetchRow got result %O", __filename, result)
		
		if (!result.records.length) {
			console.debug("%s: fetchRow => no matches", __filename)
			return 0
		}

/*		
		console.debug("%s: fetchRow result is %O", result)
		console.debug("%s: fetchRow result.records[%d] are %O", 
			__filename, result.records.length, result.records)
		console.debug("%s: fetchRow result.records[0] is %O", 
			__filename, result.records[0])
		console.debug("%s: fetchRow with get returns %O", 
			__filename, result.records[0].get(gettable))
*/
		return result.records[0].get(gettable)
	},
	fetchAll: async function(cypher, payload, gettable) {
		const result = await Database.fetchRaw(cypher, payload)

		if (!result.records.length) {
			console.debug("%s: fetchAll => no matches", __filename)
			return []
		}
		return result.records[0].get(gettable)
	},
/*	
	fetchValue: async function(cypher, payload, gettable, field) {
	},
*/	
	fetchRaw: async function(cypher, payload) {
		let session = Connection.session()

		try {
			return await session.run(cypher, payload) 
		}
		catch (err) {
			throw new Error(err)
			console.error("%s: fetchRaw failed: %s", __filename, err)
		}
		finally {
			session.close()
		}
	}
}

module.exports = Database


