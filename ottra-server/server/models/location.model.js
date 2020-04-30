const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const LocationModel = {
	createLocation: async function(payload, user_id) {
    console.debug("%s: createLocation called with payload: %O", __filename, payload)

    const cypher = `
      MATCH (u:User { uuid: {creator} })
      CREATE (u)-[:HAS]->(l:Location {
        uuid: {uuid},
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
      }) RETURN l { .*, dateTime: apoc.date.format(l.created) } AS Location`

    const data = {
      uuid: uuidv4(),
      name: payload.name,
      creator: user_id,
      address: payload.address || '',
      place_id: payload.place_id || '',
      country: payload.country || '',
      maps_url: payload.maps_url || '',
      phone_nr: payload.phone_nr || '',
      latitude: payload.latitude || 0,
      longitude: payload.longitude || 0,
      owm_cityid: payload.owm_cityid || 0,
    }

    const result = await DB.fetchRow(cypher, data, "Location")
    console.debug("%O: createLocation result is: %O", __filename, result)
    return result
	},
	getLocations: async function(user_id) {
		return await DB.fetchAll(`
      MATCH (u:User { uuid: {user_id} })-->(l:Location) 
      OPTIONAL MATCH (l)-->(r:Room)
      OPTIONAL MATCH (l)-[:ACCESS_KEY]->(k:Equipment)
      WITH COLLECT (r.uuid) as theRooms, 
           COLLECT (k.uuid) as theKeys, l
      RETURN COLLECT(l { .*, dateTime: apoc.date.format(l.created), 
          rooms: theRooms,
          accessKeys: theKeys }) AS Locations`, { 
				user_id: user_id 
			}, "Locations"
		)
	},
  getLocation: async function(user_id, loc_id) {
    return await DB.fetchRow(`
      MATCH (u:User { uuid: {user_id} })-->(l:Location { uuid: {loc_id} }) 
      OPTIONAL MATCH (l)-->(r:Room)
      OPTIONAL MATCH (l)-[:ACCESS_KEY]->(k:Equipment)
      WITH COLLECT (r.uuid) as theRooms, 
           COLLECT (k.uuid) as theKeys, l
      RETURN l { .*, 
                  dateTime: apoc.date.format(l.created), 
                  rooms: theRooms,
                  accessKeys: theKeys }) AS Locations`, { user_id, loc_id }, "Locations"
    )
  },
  deleteLocation: async function(user_id, location_id) {
    return await DB.fetchRaw(`
      MATCH (l:Location { uuid: {location_id}, creator: {user_id} }) DETACH DELETE l`, 
      { user_id, location_id }
    )
  },
  createAccessKey: async function(area_uuid, key_uuid) {
    console.debug("%s: createAccessKey called with area_uuid: %s and key_uuid: %s", __filename, area_uuid, key_uuid)
    const result = await DB.fetchRow(`
      MATCH (key { uuid: { key_uuid }}), (area { uuid: { area_uuid }})
      CREATE (area)-[r:ACCESS_KEY]->(key)
      RETURN r AS Relation`, {
        area_uuid, key_uuid
      }, "Relation")
    return result
  }
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


