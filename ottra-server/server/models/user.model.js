const DB = require('./../infra/db')
const Crypt = require('./../infra/crypt')
const uuidv4 = require('uuid/v4')

const UserModel = {
	createUser: async function(username, password) {
		const { ok, error, data: hash } = await Crypt.createPassword(password)

		if (!ok) {
			return { ok, error }
		} else {
			return await DB.fetchRow(`
				CREATE (u:User { uuid: {uuid}, password: {hash}, username: {username} })
				RETURN u { .username, .uuid } AS User`, { 
					username: username, 
					hash: hash, 
					uuid: uuidv4() 
				}, "User"
			)
		}
	},
	getUserInfoByName: async function(username) {
		return await DB.fetchRow(`
			MATCH (n:User { username: {username} }) 
			RETURN n { .* } as User
		`, { username: username }, "User")
	},
	getUserInfoById: async function(id) {
		return await DB.fetchRow(`
			MATCH (n:User { uuid: {id} }) 
			RETURN n { .* } as User
			`, { id: id }, "User"
		)
	}
}

module.exports = UserModel