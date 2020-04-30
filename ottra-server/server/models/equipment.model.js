const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const EquipmentModel = {
	createEquipment: async function(payload, user_id) {
    console.debug("%s: createEquipment called with payload: %O", __filename, payload)

    const result = await DB.fetchRow(`
      MATCH (n { uuid: {parent_uuid} })
      CREATE (n)-[:HOLDS]->(e:Equipment { 
        uuid: {new_uuid},
        name: {name}, 
        creator: {creator},
        created: TIMESTAMP()
      }) RETURN e { .*, dateTime: apoc.date.format(e.created) } AS Equipment`, 
      {
        new_uuid: uuidv4(),
        name: payload.name,
        parent_uuid: payload.container,
        creator: user_id
      }, "Equipment"
    )

    console.debug("%O: createEquipment result is: %O", __filename, result)
    return result
	},
  getEquipment: async function(user_id) {
    return await DB.fetchAll(`
      MATCH (u:User { uuid: {user_id} })-[*0..15]->(n)-[:HOLDS]->(e:Equipment)
      RETURN COLLECT(e { .*, dateTime: apoc.date.format(e.created), type: LABELS(e),
                         location: { uuid: n.uuid, type: LABELS(n) } }) AS Equipment`, {
        user_id
      }, "Equipment"
    )
  },
  getEquipmentById: async function(user_id, eq_id) {
    console.debug("%s: getEquipmentById is called with user_id: %s, eq_id: %s", 
      __filename, user_id, eq_id)    
    return await DB.fetchAll(`
      MATCH (n)-[:HOLDS]->(e:Equipment { uuid: { eq_id }})
      RETURN e { .*, dateTime: apoc.date.format(e.created), type: LABELS(e),
                         location: { uuid: n.uuid, type: LABELS(n) } } AS Equipment`, {
        eq_id: eq_id
      }, "Equipment"
    )
  }
}

module.exports = EquipmentModel



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


