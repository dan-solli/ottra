const DB = require('./../infra/db')
const Crypt = require('./../infra/crypt')

module.exports = {
	getUserAuthInfo: async function(input_username) {
		console.debug("%s: getUserAuthInfo is called with username: %s", __filename, input_username)

		const result = await DB.run('MATCH (n:User { username: {username} }) return n.password AS hash, n.uuid AS id', 
			{ username: input_username })
		if (result.length == 0)
			return 0

		console.log("user.model.js: getUserAuthInfo result for " + input_username + ": ")
		console.log(result)
		return { 
			stored_hash: result[0].get('hash'),
			uuid: result[0].get('id')
		}
	},
	createUser: async function(username, password) {
		console.debug("%s: createUser is called with user/pass: %s:%s", __filename, username, password)

		let hash = await Crypt.createPassword(password)

		const result = await DB.run('CREATE (:User { password: {hash}, username: {username} })', 
			{ username: username, hash: hash })
		console.debug("%s: createUser is returning: %O", __filename, result)
		return result			
	}
}
