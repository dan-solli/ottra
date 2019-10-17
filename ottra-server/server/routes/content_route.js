const express = require('express')
const r = express.Router()

const { validationResult,
				buildCheckFunction 
			} = require('express-validator');


//const jwtMiddleware = require('express-jwt-middleware')
//const jwtCheck = jwtMiddleware(process.env.JWT_SECRET_ACCESS)

const fs = require('fs')
const path = require('path')

const directory = path.resolve(__dirname + "/../")
console.debug("Directory is %s", directory)

const mimeTypes = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf'
}

r.get('/content/*', function(req, res) {

	const errors = validationResult(req) 

	if (!errors.isEmpty()) {
		res.status(404).end('Not found')
	}

	console.debug("Req.path is %s", req.path)

	const file = path.join(directory, req.path.replace(/\/$/, '/index.html'))

	console.debug("File has become %s", file)

	if (file.indexOf(directory + path.sep) !== 0) {
		return res.status(403).end('Forbidden')
	}
	const type = mimeTypes[path.extname(file).slice(1)] || 'text/plain'
	const s = fs.createReadStream(file)
	s.on('open', function() {
		res.set('Content-type', type)
		s.pipe(res)
	})
	s.on('error', function(err) {
		console.debug("%s: Error is: %O", __filename, err)
		res.set('Content-type', 'text/plain')
		res.status(404).end('Not found')
	})
})

module.exports = r