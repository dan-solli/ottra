const googleMapsClient = require('@google/maps').createClient({
	key: process.env.GMAPS,
	Promise: Promise
})
const GMC = require('@google/maps').util

const GeographyService = {
	searchPlace: async function(search_str) {
		console.debug("%s: searchPlace called with: %s", __filename, search_str)

		const result = await googleMapsClient.placesAutoComplete({
			input: search_str,
			sessiontoken: GMC.placesAutoCompleteSessionToken()
<<<<<<< HEAD
		}, function(err, result) {
			console.debug("%s: searchPlace result %O", __filename, result)
			console.debug("%s: searchPlace error %O", __filename, err)
			return [ result, err ]
		})
=======
		}).asPromise()
		console.debug("%s: searchPlace got result: %O", __filename, result)
		return [ result.json, null ]
>>>>>>> Ottra#76
	},
	getPlaceById: async function(place_id) {
		console.debug("%s: getPlaceById called with place_id: %s", __filename, place_id)

		const result = await googleMapsClient.place({
			placeid: place_id
		}).asPromise()
		console.debug("%s: getPlaceById got result: %O", __filename, result)
		return [ result.json, null ]
	}
}

module.exports = GeographyService

/* 

// Old functionality I may or may not want to reimplement. Currently unused.

	var CountriesList = require('countries-list')
	var Flags = require('country-flags-svg')
	var Cities = require('./city.list.json')

	r.get('/countries', function (req, res) {
		res.send(CountriesList.countries);
	});

	r.get('/country/:country_code', function (req, res) {
		let cc = req.params.country_code
		let country_data = CountriesList.countries[cc];

		country_data.flag = Flags.findFlagUrlByIso2Code(cc);
		res.send(country_data);
	})

	r.get('/country/:country_code/cities', function (req, res) {
		let cc = req.params.country_code;
		res.send(Cities.filter(function (el) { return el.country === cc; }));
	})

*/
