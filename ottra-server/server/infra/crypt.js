var bcrypt = require('bcrypt')

const { aSureThing } = require('./await-to')

module.exports = {
	comparePassword: async function(passwd, hash) {
		return await aSureThing(bcrypt.compare(passwd, hash))
	},
	createPassword: async function(passwd) {
		const salt = await aSureThing(bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS, 10)))

		if (salt.ok) {
			return await aSureThing(bcrypt.hash(passwd, salt.data))
		} else {
			return salt
		}
	}
}