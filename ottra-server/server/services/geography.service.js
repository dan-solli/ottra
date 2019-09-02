const googleMapsClient = require('@google/maps').createClient({
	key: process.env.GMAPS,
	Promise: Promise
})

const GMC = require('@google/maps').util

const GeographyService = {
	searchPlace: function(search_str) {
		googleMapsClient.placesAutoComplete({
			input: search_str,
			sessiontoken: GMC.placesAutoCompleteSessionToken()
		}).asPromise()
		.then(function(response) {
			return { ok: true, data: response.json }
		})
		.catch(function(err) {
			return { ok: false, error: err }
		})
	},
	getPlaceById: function(place_id) {
		googleMapsClient.place({
			placeid: place_id
		}).asPromise()
		.then(function(response) {
			return { ok: true, data: response.json }
		})
		.catch(function(err) {
			return { ok: false, error: err }
		})
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
