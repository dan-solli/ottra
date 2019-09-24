const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const StorageModel = {
	createStorage: async function(payload, user_id) {
    console.debug("%s: createStorage called with payload: %O", __filename, payload)

    const result = await DB.fetchRow(`
      MATCH (n { uuid: {parent_uuid} })
      CREATE (n)-[:CONTAINS]->(s:Storage { 
        uuid: {new_uuid},
        name: {name}, 
        creator: {creator},
        created: TIMESTAMP(),
        mobile: {mobile},
        current_container: {current_container}
      }) RETURN s { .*, dateTime: apoc.date.format(s.created) } AS Storage`, 
      {
        new_uuid: uuidv4(),
        name: payload.name,
        parent_uuid: payload.container,
        creator: user_id,
        mobile: payload.mobile || false,
        current_container: payload.current_container || null
      }, "Storage"
    )

    console.debug("%O: createStorage result is: %O", __filename, result)
    return result
	},
  getStorages: async function(user_id) {
    return await DB.fetchAll(`
      MATCH (u:User { uuid: {user_id} })-[*0..15]->(n)-[:CONTAINS]->(s:Storage)
      OPTIONAL MATCH (s)-[:CONTAINS]->(ss:Storage)
      OPTIONAL MATCH (s)-[:HOLDS]->(e:Equipment)
      WITH COLLECT(ss.uuid) AS SubStorages, 
           COLLECT(e.uuid) AS Equipments, n, s
      RETURN COLLECT(s { .*, 
                 storages: SubStorages,
                 equipment: Equipments,
                 dateTime: apoc.date.format(s.created), 
                 type: LABELS(s),
                 location: { uuid: n.uuid, type: LABELS(n) } }) 
       AS Storages`, {
        user_id
      }, "Storages"
    )
  },
  getStorageById: async function(user_id, storage_id) {
    return await DB.fetchRow(`
      MATCH (u:User { uuid: {user_id} })-[*0..15]->(n)-[:CONTAINS]->(s:Storage { uuid: {storage_id} })
      OPTIONAL MATCH (s)-[:CONTAINS]->(ss:Storage)
      OPTIONAL MATCH (s)-[:HOLDS]->(e:Equipment)
      WITH COLLECT(ss.uuid) AS SubStorages, 
           COLLECT(e.uuid) AS Equipments, n, s
      RETURN s { .*, 
                 storages: SubStorages,
                 equipment: Equipments,
                 dateTime: apoc.date.format(s.created), 
                 type: LABELS(s),
                 location: { uuid: n.uuid, type: LABELS(n) } } 
       AS Storage`, {
        user_id, storage_id
      }, "Storage"
    )
  }
}

/* Put this in getStorages!
MATCH (u:User { uuid: {user_id} })-[*0..15]->(n)-[:CONTAINS]->(s:Storage)
OPTIONAL MATCH (s)-[:CONTAINS]->(ss:Storage)
OPTIONAL MATCH (s)-[:HOLDS]->(e:Equipment)
WITH COLLECT(ss.uuid) AS SubStorages, 
     COLLECT(e.uuid) AS Equipments, n, s
RETURN COLLECT(s { .*, 
           storages: SubStorages,
                   equipment: Equipments,
                   dateTime: apoc.date.format(s.created), 
                   type: LABELS(s),
                   location: { uuid: n.uuid, type: LABELS(n) } }) 
       AS Storages
*/

module.exports = StorageModel



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

