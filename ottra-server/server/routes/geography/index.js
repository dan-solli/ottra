var express = require('express')
//var config = require('./../../config')
var CountriesList = require('countries-list')
var Flags = require('country-flags-svg')
var Cities = require('./city.list.json')
let googleMapsClient = require('@google/maps').createClient({
	key: process.env.GMAPS
})
let gmc = require('@google/maps').util


module.exports = function(app, driver) {
	let r = express.Router();
	let session = driver.session();

/*
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

	r.get('/search/:search_str', function (req, res) {
		let str = req.params.search_str

		googleMapsClient.placesAutoComplete({
			input: str,
			sessiontoken: gmc.placesAutoCompleteSessionToken(),
		}, function(err, result) {
			if (!err) {
				let list = result.json.predictions
				//console.log(result)
				res.send(list)
			}
			else {
				console.log("EP: /geography/search/:search_str failed: " + err)
			}
		})
	})

	r.get('/place/:place_id', function (req, res) {
		let place_id = req.params.place_id

		console.log("Called /geography/place/" + place_id)

		googleMapsClient.place({
			placeid: place_id
		}, function(err, return_value) {
			console.log("Result received")
			//console.log(res)
			if (!err) {
				//console.log(res.json.result)
				res.send(return_value.json.result)
			}
			else {
				console.log("EP: /geography/place/:place_id failed: " + err)
			}
		})

	}) 

	return r;
}
