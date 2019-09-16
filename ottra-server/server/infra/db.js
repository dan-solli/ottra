const Neo4J = require('neo4j-driver').v1
const { aSureThing } = require('./await-to')

const Connection = Neo4J.driver(process.env.NEO4J_URL, 
																Neo4J.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD), {
																	disableLosslessIntegers: true
																}
															)

const Database = {
	run: async function(cypher, payload, gettable = null) {
		let session = Connection.session()

		console.warn("%s: Function 'run' is deprecated. Please replace!", __filename)
		try {
			const result = await session.run(cypher, payload)

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
		const { ok, error, data } = await Database.fetchRaw(cypher, payload)
		
		if (!ok) {
			return { ok, error }
		}
		else if (!data.records.length) {
			console.debug("%s: fetchRow => no matches", __filename)
			return { ok, data: null }
		} else {
			return { ok, data: data.records[0].get(gettable) }
		}
	},
	fetchAll: async function(cypher, payload, gettable) {
		const { ok, error, data } = await Database.fetchRaw(cypher, payload)

		if (!ok) {
			return { ok, error }
		}
		else if (!data.records.length) {
			console.warn("%s: fetchAll => no matches", __filename)
			return { ok, data: null }
		} else {
			return { ok, data: data.records[0].get(gettable) }
		}
	},
	fetchRaw: async function(cypher, payload) {
		let session = Connection.session()

		//console.debug("%s: Running Cypher:\n%s\nwith payload:\n%O", __filename, cypher, payload)

		const result = await aSureThing(session.run(cypher, payload))

		//console.debug("%s: fetchRaw result is %O", __filename, result)

		session.close()
		return result
	}
}

module.exports = Database


