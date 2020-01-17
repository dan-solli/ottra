const express = require('express')

const DocumentModel = require('./../models/document.model')

const { sendResponse } = require('./../infra/response.js')

const dirTree = require('directory-tree')
const traverse = require('traverse')
const thePath = require('path')

const DB = require('./../infra/db')

const r = express.Router()

r.get("/", async function(req, res) {
	res.send(resultData)
})


module.exports = r