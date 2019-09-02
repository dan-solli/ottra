const express = require('express')

const GeographyService = require('./../services/geography.service')
const { sendResponse } = require('./../infra/response.js')

const r = express.Router()

r.get("/search/:search_str", async function(req, res) {
	const search_str = req.params.search_str

	sendResponse(res, await GeographyService.searchPlace(search_str))	
})

r.get("/place/:place_id", async function(req, res) {
	const place_id = req.params.place_id

	sendResponse(res, await GeographyService.getPlaceById(place_id))	
})

module.exports = r