const express = require('express')

const DocumentModel = require('./../models/document.model')

const { sendResponse } = require('./../infra/response.js')

const dirTree = require('directory-tree')
const traverse = require('traverse')
const thePath = require('path')

const DB = require('./../infra/db')

const r = express.Router()

r.get("/", async function(req, res) {
	sendResponse(res, await DB.fetchRow(`
		CREATE (n:Testnode)
		SET n += { hash }
		RETURN n { .* } AS Testnode`, { hash: { a: 1, b: "Apa", c: 3.14 }}, "Testnode"
	))
})


module.exports = r