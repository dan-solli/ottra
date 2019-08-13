const DB = require('./../infra/db')
const Crypt = require('./../infra/crypt')
const uuidv4 = require('uuid/v4')

const UserModel = {
	createUser: async function(username, password) {
		console.debug("%s: createUser is called with user/pass: %s:%s", __filename, username, password)

		const hash = await Crypt.createPassword(password)

		const result = await DB.fetchRow(`
			CREATE (u:User { uuid: {uuid}, password: {hash}, username: {username} })
			RETURN u { .username, .uuid } AS User`, { 
				username: username, 
				hash: hash, 
				uuid: uuidv4() 
			}, "User"
		)
		console.debug("%s: createUser is returning: %O", __filename, result)
		return result
	},
	getUserInfoByName: async function(username) {
		console.debug("%s: getUserInfoByName is called with username: %s", __filename, username)

		const result = await DB.fetchRow(`
			MATCH (n:User { username: {username} }) 
			RETURN n { .* } as User
		`, { username: username }, "User")

		console.debug("%s: getUserInfoByName returns: %O", __filename, result)

		if (typeof(result) === 'undefined') {
			console.debug("%s: getUserInfoByName found no matches for %s", __filename, username)
			return 0
		}
		return result
	},
	getUserInfoById: async function(id) {
		console.debug("%s: getUserInfoById is called with id: %s", __filename, id)

		const result = await DB.fetchRow(`
			MATCH (n:User { uuid: {id} }) 
			RETURN n { .* } as User
			`, { id: id }, "User"
		)

		console.debug("%s: getUserInfoById returns: %O", __filename, result)

		if (typeof(result) === 'undefined') {
			console.debug("%s: getUserInfoById found no matches for %s", __filename, id)
			return 0
		}
		return result
	}
}

module.exports = UserModel