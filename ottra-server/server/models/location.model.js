const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const LocationModel = {
	createLocation: async function(payload, user_id) {
		console.debug("%s: createLocation is called with payload: %O", __filename, payload)

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
				location_name: payload.locationName,
			}, "Group"
		)
		console.debug("%s: createLocation creation result is: %O", __filename, result)
		return result
	},
	getLocations: async function(user_id) {
		console.debug("%s: getLocations is called with user_id: %s", __filename, user_id)

		const result = await DB.fetchAll(`
MATCH (l:Location { uuid: {uuid}})-->(r:Room), (l)-->(g:Geolocation), (l)-->(a:Address)
WITH collect(r.uuid) as rm, a, g, l
RETURN apoc.map.groupBy(collect(l { .*, Rooms: rm, 
	Address: a { .* }, 	Geolocation: g { .* } } ), "uuid") as Locations`, { 
				uuid: user_id 
			}, "Locations")

		console.debug("%s: getLocations db-fetch returns: %O", __filename, result)

		if (result.length == 0) {
			console.debug("%s: getLocations found no matches for %s", __filename, user_id)
			return 0
		}

/*

It does seem like, due to my shortcomings of Cypher, need to filter/mix/match outside the queries.-

MATCH (l:Location { uuid: '091a6ba0-1008-11e9-af35-4ccc6ad3c941'})
RETURN l {.*,
  Rooms: [ (l)-[]->(r:Room) | r { .* } ],
  Address: [ (l)-[]->(a:Address) | a { .* } ][0],
  Geolocation: [ (l)-[]->(g:Geolocation) | g { .* } ][0] }

GETTING THERE!

MATCH (l:Location { uuid: '091a6ba0-1008-11e9-af35-4ccc6ad3c941'})-->(r:Room), (l)-->(g:Geolocation), (l)-->(a:Address)
RETURN l { .*, 
	Rooms: apoc.map.groupBy(collect(r { .* }), "uuid"),
    Address: apoc.map.groupBy(collect(a { .* }), "uuid"), 
    Geolocation: apoc.map.groupBy(collect(g { .* }), "uuid")
} as Location

THIS MIGHT BE IT (for a list of locations, not necessarily a single location)

MATCH (l:Location { uuid: '091a6ba0-1008-11e9-af35-4ccc6ad3c941'})-->(r:Room), (l)-->(g:Geolocation), (l)-->(a:Address)
WITH apoc.map.groupBy(collect(r { .* }), "uuid") as rm, 
     apoc.map.groupBy(collect(a { .* }), "uuid") as am,
     apoc.map.groupBy(collect(g { .* }), "uuid") as gm, l
RETURN apoc.map.groupBy(collect(l { .*, Rooms: rm, Address: am, Geolocation: gm } ), "uuid") as Location

Now, for next step! Only collect id of subordinates

MATCH (l:Location { uuid: '091a6ba0-1008-11e9-af35-4ccc6ad3c941'})-->(r:Room), (l)-->(g:Geolocation), (l)-->(a:Address)
WITH collect(r.uuid) as rm, 
     apoc.map.groupBy(collect(a { .* }), "uuid") as am,
     apoc.map.groupBy(collect(g { .* }), "uuid") as gm, l
RETURN apoc.map.groupBy(collect(l { .*, Rooms: rm, Address: am, Geolocation: gm } ), "uuid") as Location

*** THIS MIGHT BE THE FINAL ANSWER (for a single location):

MATCH (l:Location { uuid: '091a6ba0-1008-11e9-af35-4ccc6ad3c941'})-->(r:Room), (l)-->(g:Geolocation), (l)-->(a:Address)
WITH collect(r.uuid) as rm, a, g, l
RETURN apoc.map.groupBy(collect(l { .*, Rooms: rm, Address: a { .* }, Geolocation: g { .* } } ), "uuid") as Location

*/

		return result		
	},
	updateLocation: async function(payload) {
		console.debug("%s: updateLocation is called with payload: %O", __filename, payload)

		const result = await DB.fetchRow(`
			MATCH (l:Location { uuid: {loc_id} })

		`)
	}
}

module.exports = LocationModel