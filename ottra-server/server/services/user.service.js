const UserModel = require('./../models/user.model')
const MsgModel = require('./../models/message.model')

const AuthService = require('./auth.service')

const Crypt = require('./../infra/crypt')

const UserService = {
	authenticateUser: async function(payload) {
		const getUserResult = await UserModel.getUserInfoByName(payload.username)

		if (!getUserResult.ok || (getUserResult.ok && getUserResult.data === null)) {
			return { ok: false, error: {
					status: 'failed', message: 'No such user', code: 401
				} 
			}
		} else {
			const { password: stored_hash = null, uuid = null	} = getUserResult.data

			if (stored_hash === null || uuid === null) {
				return { ok: false, error: {
						status: 'failed', message: 'No such user', code: 401
					} 
				}
			}

			const { ok, error } = await Crypt.comparePassword(payload.password, stored_hash)
			if (ok) {
				const response = {
					username: payload.username,
					uuid: uuid,
				}

				const accessTokenResult = await AuthService.generateToken(process.env.JWT_ACCESS_TOKEN_TYPE, response)
				if (accessTokenResult.ok) {
					response.accessToken = accessTokenResult.data
				} else {
					return { ok: false, error } 
				}

				const refreshTokenResult = await AuthService.generateToken(process.env.JWT_REFRESH_TOKEN_TYPE, response)
				if (refreshTokenResult.ok) {
					response.refreshToken = refreshTokenResult.data
				} else {
					return { ok: false, error }
				}
				// TODO: process.emit('eUserLogin', response)
				return { ok: true, data: response }
			} else {
				process.emit('eUserLoginFailed', { payload })
				return { ok: false, error: { status: 'failed', message: 'Login could not happen',	code: 401
					} 
				}
			}
		}
	},
	createUser: async function(payload) {
		const getAuthInfo = await UserModel.getUserInfoByName(payload.username)

		console.debug("%s: getAuthInfo is: %O", __filename, getAuthInfo)

		if (getAuthInfo.ok && getAuthInfo.data != null) {
			return { ok: false, error: {
					status: 'failed', message: 'User already exist', code: 403
				} 
			}
		}

		const { ok, error, data } = await UserModel.createUser(payload.username, payload.password)

		console.debug("%s: createUserResult is: %O", __filename, { ok: ok, error: error, data: data })

		if (!ok) {
			return { ok, error }
		} else {
			const accessTokenResult = await AuthService.generateToken(process.env.JWT_ACCESS_TOKEN_TYPE, data)
			if (accessTokenResult.ok) {
				data.accessToken = accessTokenResult.data
			} else {
				return { ok: false, error: accessTokenResult.error } 
			}

			const refreshTokenResult = await AuthService.generateToken(process.env.JWT_REFRESH_TOKEN_TYPE, data)
			if (refreshTokenResult.ok) {
				data.refreshToken = refreshTokenResult.data
			} else {
				return { ok: false, error: refreshTokenResult.error }
			}
		}
		// TODO: process.emit('eNewUser', response.uuid)

		console.debug("%s: createUser returns is: %O", __filename, { ok: true, data: data })

		return { ok: true, data: data }
	},
	getUser: async function(user_id) {
		const userInfo = await UserModel.getUserInfoById(user_id)

		console.debug("%s: getUser is: %O", __filename, userInfo)

		return userInfo
	}
}

process.on('eNewUser', async function(uuid) {
	console.debug("%s: Caught event eNewUser with uuid: %s", __filename, uuid)
	// God how I want to handle this differently. Another day. Issue created!
	await MsgModel.saveMessage({
		sender: 'System',
		recipient: uuid,
		subject: '(*) Complete your user profile.',
		body: '(*) You now have a new user! Complete your user profile!',
		timeToLive: -1,
		type: 'system#usertodo#profile-settings'
	})
	await MsgModel.saveMessage({
		sender: 'System',
		recipient: uuid,
		subject: '(*) Customize your user experience.',
		body: '(*) Take a look at how you can customize your user experience with Ottra!',
		timeToLive: -1,
		type: 'system#usertodo#general-settings'
	})
	await MsgModel.saveMessage({
		sender: 'System',
		recipient: uuid,
		subject: '(*) Start creating your home!',
		body: '(*) Time to create your home, populate it with rooms and stuff!',
		timeToLive: -1,
		type: 'system#usertodo#createlocation'
	})
	await MsgModel.saveMessage({
		sender: 'System',
		recipient: uuid,
		subject: '(*) Create a group!',
		body: '(*) If you belong to a group of people who share tasks, you can create one here!',
		timeToLive: -1,
		type: 'system#usertodo#creategroup'
	})
})

module.exports = UserService