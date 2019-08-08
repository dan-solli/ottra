const AuthModel = require('./../models/auth.model')

const JWT = require('jsonwebtoken')

const AuthService = {
	refreshToken: async function(payload) {
		console.debug("%s: refreshToken is called with payload: %O", __filename, payload)

		if (payload.refreshToken && await AuthModel.refreshTokenExist(payload.refreshToken)) {
			const userInfo = {
				username: payload.username,
				id: payload.uuid
			}
			userInfo.accessToken = await AuthService.generateAccessToken(userInfo)
			userInfo.refreshToken = payload.refreshToken

			console.debug("%s: refreshToken is emitting event eUserTokenRefreshed with: %O",
				__filename, userInfo)
			process.emit('eUserTokenRefreshed', userInfo)
			return {
				"token": userInfo.accessToken
			}
		}	else {
			return {
				status: 'failed',
				message: 'Token could not be refreshed',
				code: 404
			}
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