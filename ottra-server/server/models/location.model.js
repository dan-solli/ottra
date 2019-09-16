const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const LocationModel = {
	createLocation: async function(payload, user_id) {
    console.debug("%s: createLocation called with payload: %O", __filename, payload)

    const result = await DB.fetchRow(`
      MATCH (u:User { uuid: {creator} })
      CREATE (l:Location {
        uuid: {new_uuid},
        name: {name}, 
        creator: {creator},
        created: TIMESTAMP(),
        address: {address},
        place_id: {place_id},
        country: {country},
        maps_url: {maps_url},
        phone_nr: {phone_nr},
        latitude: {latitude},
        longitude: {longitude},
        owm_cityid: {owm_cityid}
      })<-[:HAS]-(u) RETURN l { .*, dateTime: apoc.date.format(l.created) } AS Location`, 
      {
        new_uuid: uuidv4(),
        name: payload.name,
        creator: user_id,
        address: payload.address,
        place_id: payload.place_id,
        country: payload.country,
        maps_url: payload.maps_url,
        phone_nr: payload.phone_nr,
        owm_cityid: payload.owm_cityid,
        latitude: payload.latitude,
        longitude: payload.longitude
      }, "Location")

    console.debug("%O: createLocation result is: %O", __filename, result)
    return result
	},
	getLocations: async function(user_id) {
    // Doesn't work!
		return await DB.fetchAll(`
			MATCH (l:Location { uuid: {uuid}})-->(r:Room), (l)-->(g:Geolocation), (l)-->(a:Address)
			WITH collect(r.uuid) as rm, a, g, l
			RETURN apoc.map.groupBy(collect(l { .*, Rooms: rm, 
				Address: a { .* }, 	Geolocation: g { .* } } ), "uuid") as Locations`, { 
				uuid: user_id 
			}, "Locations"
		)
	},
}


module.exports = LocationModel



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


