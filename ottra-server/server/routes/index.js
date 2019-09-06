const express = require('express')
const r = express.Router()

const jwtMiddleware = require('express-jwt-middleware')
const jwtCheck = jwtMiddleware(process.env.JWT_SECRET_ACCESS)

r.use('/1/auth', (require('./../api/auth.controller')))

r.get('/1/showstuff', function (req, res) {
	res.send(req.headers)
})

//r.use('/1/upload', (require('./../api/upload.controller')))

r.use(jwtCheck)

r.use('/1/message', (require('./../api/message.controller')))
r.use('/1/group', (require('./../api/group.controller')))
r.use('/1/geography', (require('./../api/geography.controller')))
r.use('/1/location', (require('./../api/location.controller')))
r.use('/1/document', (require('./../api/document.controller')))
r.use('/1/user', (require('./../api/user.controller')))

module.exports = r

