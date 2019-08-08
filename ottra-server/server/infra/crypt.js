var bcrypt = require('bcrypt')

module.exports = {
	comparePassword: async function(passwd, hash) {
		return await bcrypt.compare(passwd, hash)
	},
	createPassword: async function(passwd) {
		const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS, 10))
		return await bcrypt.hash(passwd, salt)
	}
}