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
      RETURN COLLECT(r { .*,
        dateTime: apoc.date.format(r.created),
        type: LABELS(r),
        location: { uuid: l.uuid, type: LABELS(l) },
        storages: [ (r)-[:CONTAINS]->(s:Storage) | s.uuid ],
        equipment: [ (r)-[:HOLDS]->(e:Equipment) | e.uuid ],
        accessKeys: [ (r)-[:ACCESS_KEY]->(k:Equipment) | k.uuid ]
      }) As Room`, { user_id }, "Room"
    )
  },
}


module.exports = RoomModel

