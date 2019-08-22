const express = require('express')

const SendResponse = require('./../infra/response.js')

const r = express.Router()

r.post("/:related_id", async function(req, res) {
	const search_str = req.params.related_id

	console.debug("%s: GET /upload: called with param %s", __filename, search_str)
	console.debug("%s: Request.files are: %O", __filename, req.files)
	res.send("Ok")
})

module.exports = r