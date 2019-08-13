const express = require('express')

const GeographyService = require('./../services/geography.service')
const SendResponse = require('./../infra/response.js')

const r = express.Router()

r.get("/search/:search_str", async function(req, res) {
	const search_str = req.params.search_str

	console.debug("%s: GET /search: called with param %s", __filename, search_str)
	SendResponse.response(res, await GeographyService.searchPlace(search_str))	
})

r.get("/place/:place_id", async function(req, res) {
	const place_id = req.params.place_id

	console.debug("%s: GET /place: called with param %s", __filename, place_id)
	SendResponse.response(res, await GeographyService.getPlaceById(place_id))	
})

module.exports = r