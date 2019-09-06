const JWT = require('jsonwebtoken')
const { aSureThing } = require('./../infra/await-to')

const AuthService = {
	refreshToken: async function(payload) {
		try {
			const decoded = JWT.verify(payload.refreshToken, process.env.JWT_SECRET_REFRESH)

			const userInfo = {
				uuid: decoded.uuid,
				username: decoded.username
			}
			return AuthService.generateToken(process.env.JWT_ACCESS_TOKEN_TYPE, userInfo)
		}
		catch (err) {
			return { ok: false, error: { code: 401, status: 'failed', message: err } }
		}
	},
	generateToken: function(type, payload) {
		var secret, tokenLife

		if (type === process.env.JWT_ACCESS_TOKEN_TYPE) {
			secret = process.env.JWT_SECRET_ACCESS
			tokenLife = process.env.JWT_ACCESS_TOKEN_LIFE
		} else if (type === process.env.JWT_REFRESH_TOKEN_TYPE) {
			secret = process.env.JWT_SECRET_REFRESH
			tokenLife = process.env.JWT_REFRESH_TOKEN_LIFE
		} else {
			return { ok: false, error: { code: 401, status: 'failed', message: 'No such token type' } }
		}
		try {
			const token = JWT.sign(payload, secret, { expiresIn: tokenLife })
			return { ok: true, data: token }
		} catch(err) {
			return { ok: false, error: { code: 401, status: 'failed', message: err } }		
		}
	},
	generateAccessToken: function(payload) {
		console.warn("%s: Function generateAccessToken is deprecated, use generateToken instead")
		return new Promise(function(resolve, reject) {
			JWT.sign(payload, process.env.JWT_SECRET_ACCESS, 
				{ expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }, 
				function(error, token) {
					return error ? resolve(token) : reject(error)
				}
			)
		})
	},
	generateRefreshToken: function(payload) {
		console.warn("%s: Function generateRefreshToken is deprecated, use generateToken instead")
		return new Promise(function(resolve, reject) {
			JWT.sign(payload, process.env.JWT_SECRET_REFRESH, 
				{ expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE }, 
				function(error, token) {
					return error ? resolve(token) : reject(error)
				}
			)
		})
	},
}

module.exports = AuthService