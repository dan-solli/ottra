const DB = require('./../infra/db')
const Crypt = require('./../infra/crypt')

const UserModel = {
	createUser: async function(username, password) {
		console.debug("%s: createUser is called with user/pass: %s:%s", __filename, username, password)

		let hash = await Crypt.createPassword(password)

		await DB.run('CREATE (:User { password: {hash}, username: {username} })', 
			{ username: username, hash: hash })
		const { id, username: new_username } = await UserModel.getUserInfoByName(username)
		console.debug("%s: createUser is returning: %s", __filename, id)
		return {
			id: id,
			username: new_username
		}
	},
	getUserInfoByName: async function(username) {
		console.debug("%s: getUserInfoByName is called with username: %s", __filename, username)

		const result = await DB.run(`
			MATCH (n:User { username: {username} }) return COLLECT (n { .* }) as User
		`, { username: username }, "User")

		console.debug("%s: getUserInfoByName db-fetch returns: %O", __filename, result)

		if (result.length == 0) {
			console.debug("%s: getUserInfoByName found no matches for %s", __filename, username)
			return 0
		}
		return result
	},
	getUserInfoById: async function(id) {
		console.debug("%s: getUserInfoById is called with id: %s", __filename, id)

		const result = await DB.run(`
			MATCH (n:User { uuid: {id} }) return COLLECT (n { .* }) as User
		`, { id: id }, "User")

		console.debug("%s: getUserInfoById db-fetch returns: %O", __filename, result)

		if (result.length == 0) {
			console.debug("%s: getUserInfoById found no matches for %s", __filename, id)
			return 0
		}
		return result
	}
}

module.exports = UserModel