const express = require('express')
const r = express.Router()

const jwtMiddleware = require('express-jwt-middleware')
const jwtCheck = jwtMiddleware(process.env.JWT_SECRET_ACCESS)

r.use('/1/auth', (require('./../api/auth.controller')))

r.use(jwtCheck)

r.use('/1/message', (require('./../api/message.controller')));
r.use('/1/group', (require('./../api/group.controller')));
r.use('/1/geography', (require('./../api/geography.controller')));

module.exports = r

