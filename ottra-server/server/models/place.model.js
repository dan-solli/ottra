const DB = require('./../infra/db')
const uuidv4 = require('uuid/v4')

const PlaceModel = {
	createPlace: async function(payload, user_id) {
		const { 
			address = '',
			place_id,
			country = '',
			maps_url = '',
			phone_nr = '',
			latitude = 0,
			longitude = 0,
			owm_cityid = ''
		} = payload

		return await DB.fetchRow(`
	CREATE (p:Place { 
						uuid: {new_uuid}, 
						address: {address},
						place_id: {place_id},
						country: {country},
						maps_url: {maps_url},
						phone_nr: {phone_nr},
						latitude: {latitude},
						longitude: {longitude},
						owm_cityid: {owm_cityid},
						creator: {creator},
						created: TIMESTAMP()
					}) return p { .* } as Place`, { 
						new_uuid: uuidv4(), 
						address: address,
						place_id: place_id,
						country: country,
						maps_url: maps_url,
						phone_nr: phone_nr,
						owm_cityid: owm_cityid,
						latitude: latitude,
						longitude: longitude,
						creator: user_id
					}, "Place"
		)
	},
	getPlaceByPlaceId: async function(place_id) {
		console.debug("%s: getPlaceByPlaceID called with %s", __filename, place_id)
		return await DB.fetchRow(`
			MATCH (p:Place { place_id : { place_id }}) 
			RETURN p { .*, dateTime: apoc.date.format(p.created) } AS Place`,
			{ place_id: place_id }, "Place")
	},
	getPlaceByUUID: async function(uuid) {
		return await DB.fetchRow(`
			MATCH (p:Place { uuid : { uuid }}) 
			RETURN p { .*, dateTime: apoc.date.format(p.created) } AS Place`,
			{ uuid: uuid }, "Place")
	},
/*
	getPlaces: async function(uuid) {
		// Once a few locations has been saved. Work on this one. It might be weather-important. Or not.
		// Make a separate issue to analyse. In the mean time, comment it out.

		return await DB.fetchAll(`
	MATCH (:User { uuid: { uuid }})-[r:HAS]->(t:Todo)
	RETURN COLLECT (t { .*, dateTime: apoc.date.format(t.sent), relType: TYPE(r) }) AS Todos`,
		{ uuid: uuid }, "Places")
	}
*/

}

module.exports = PlaceModel