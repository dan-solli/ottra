  const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const RoomModel = {
	createRoom: async function(payload, user_id) {
    console.debug("%s: createRoom called with payload: %O", __filename, payload)

    const result = await DB.fetchRow(`
      MATCH (l:Location { uuid: {location_uuid} })
      CREATE (l)-[:CONTAINS]->(r:Room { 
        uuid: {new_uuid},
        name: {name}, 
        creator: {creator},
        created: TIMESTAMP()
      }) RETURN r { .*, dateTime: apoc.date.format(r.created) } AS Room`, 
      {
        new_uuid: uuidv4(),
        name: payload.name,
        location_uuid: payload.location,
        creator: user_id
      }, "Room"
    )

    console.debug("%O: createRoom result is: %O", __filename, result)
    return result
	},
  // Is this being used? Should it be used? Can it be deprecated?
	getRoomsByLocation: async function(location_id, user_id) {
		return await DB.fetchAll(`
      MATCH (l:Location { uuid: {location_id} })-[:CONTAINS]->(r:Room)
      RETURN COLLECT(r { .*, dateTime: apoc.date.format(r.created)}) AS Rooms`, {
      	location_id 
      }, "Locations"
		)
	},
  getRoomById: async function(user_id, room_id) {
    return await DB.fetchRow(`
      MATCH (u:User { uuid: {user_id} })-->(l:Location)-->(r:Room { uuid: {room_id} })
      OPTIONAL MATCH (r)-[:CONTAINS]->(s:Storage)
      OPTIONAL MATCH (r)-[:HOLDS]->(e:Equipment)
      OPTIONAL MATCH (r)-[:ACCESS_KEY]->(k:Equipment)
      WITH COLLECT(s.uuid) AS Storages, 
           COLLECT(e.uuid) AS Equipments, 
           COLLECT(k.uuid) AS AccessKeys,
           l, r
      RETURN r { .*, 
                storages: Storages, 
                equipment: Equipments,
                accessKeys: AccessKeys,
                dateTime: apoc.date.format(r.created), 
                type: LABELS(r),
                location: { uuid: l.uuid, type: LABELS(l) } } AS Room`, {
        user_id, room_id
      }, "Room"
    )
  },
  getRooms: async function(user_id) {
    return await DB.fetchAll(`
      MATCH (u:User { uuid: {user_id} })-->(l:Location)-->(r:Room)
      OPTIONAL MATCH (r)-[:CONTAINS]->(s:Storage)
      OPTIONAL MATCH (r)-[:HOLDS]->(e:Equipment)
      OPTIONAL MATCH (r)-[:ACCESS_KEY]->(k:Equipment)
      WITH COLLECT(s.uuid) AS Storages, 
           COLLECT(e.uuid) AS Equipments, 
           COLLECT(k.uuid) AS AccessKeys,
           l, r
      RETURN COLLECT(r { .*, 
                storages: Storages, 
                equipment: Equipments,
                accessKeys: AccessKeys,
                dateTime: apoc.date.format(r.created), 
                type: LABELS(r),
                location: { uuid: l.uuid, type: LABELS(l) } }) AS Rooms`, {
        user_id
      }, "Rooms"
    )
  },
/*


      MATCH (u:User { uuid: {user_id} })-->(l:Location)-->(r:Room)
      RETURN COLLECT(r { .*, dateTime: apoc.date.format(r.created), type: LABELS(r),
                    location: { uuid: l.uuid, type: LABELS(l) } }) AS Rooms          
*/       
}


module.exports = RoomModel



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


