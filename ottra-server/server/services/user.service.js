const UserModel = require('./../models/user.model')
const MsgModel = require('./../models/message.model')

const AuthService = require('./auth.service')

const Crypt = require('./../infra/crypt')

const UserService = {
	authenticateUser: async function(payload) {
		console.debug("%s: authenticateUser called with payload: %O", __filename, payload)

		let { stored_hash, uuid } = await UserModel.getUserAuthInfo(payload.username)
		if (await Crypt.comparePassword(payload.password, stored_hash)) {
			const response = {
				username: payload.username,
				id: uuid,
			}
			response.accessToken = await AuthService.generateAccessToken(response)
			response.refreshToken = await AuthService.generateRefreshToken(response)

			console.debug("%s: authenticateUser: Emitting eUserLogin with: %O", 
				__filename, response.id)
			process.emit('eUserLogin', response.id)

			console.debug("%s: authenticateUser is returning: %O", __filename, response)
			return response
		} else {
			process.emit('eUserLoginFailed', { payload })
			return { 
				status: 'failed',
				message: 'Login could not happen',
				code: 201
			}
		}
	},
	createUser: async function(payload) {
		console.debug("%s: createUser called with payload: %O", __filename, payload)

		let authInfo = await UserModel.getUserAuthInfo(payload.username)
		if (authInfo) {
			return {
				status: 'failed',
				message: 'User already exist',
				code: 403
			}
		}

		await UserModel.createUser(payload.username, payload.password)
		let { uuid } = await UserModel.getUserAuthInfo(payload.username)
		let response = {
			username: payload.username,
			id: uuid
		}
		response.accessToken = await AuthService.generateAccessToken(response)
		response.refreshToken = await AuthService.generateRefreshToken(response)

		console.debug("%s: createUser: Emitting eNewUser with: %O", __filename, response.id)
		process.emit('eNewUser', response.id)

		console.debug("%s: createUser is returning: %O", __filename, response)
		return response
	},
	refreshToken: async function(payload) {
		console.debug("%s: refreshToken called with payload: %O", __filename, payload)
		return await this.db('refreshToken', this.loginInfo)
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