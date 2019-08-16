const AuthModel = require('./../models/auth.model')

const JWT = require('jsonwebtoken')

const AuthService = {
	refreshToken: async function(payload) {
		console.debug("%s: refreshToken is called with payload: %O", __filename, payload)

		// TODO: Actually control if the refreshToken is valid. Somehow.
		if (payload.refreshToken) {
			try {
				const decoded = JWT.verify(payload.refreshToken, process.env.JWT_SECRET_REFRESH)

				console.log("%s: refreshToken: Decoded token is: %O", __filename, decoded)

				const userInfo = {
					uuid: decoded.uuid,
					username: decoded.username
				}
				const accessToken = await AuthService.generateAccessToken(userInfo)

				return [ { 
					token: accessToken 
				}, null]

			}
			catch (err) {
				return [ null, {
					status: 'failed',
					message: 'Token could not be refreshed',
					code: 404
				} ]
			}
		} else {
			return [ null, {
				status: 'failed',
				message: 'Token could not be refreshed',
				code: 404
			} ]
		}
	},
	generateAccessToken: async function(payload) {
		console.debug("%s: generateAccessToken is called with payload: %O", __filename, payload)
		return await JWT.sign(
			payload,
			process.env.JWT_SECRET_ACCESS,
			{
				expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE
			}
		)
	},
	generateRefreshToken: async function(payload) {
		console.debug("%s: generateRefreshToken is called with payload: %O", __filename, payload)
		return await JWT.sign(
			payload,
			process.env.JWT_SECRET_REFRESH,
			{
				expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE
			}
		)
	},
}

module.exports = AuthService