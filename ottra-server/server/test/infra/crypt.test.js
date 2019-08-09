const expect = require('chai').expect

const Crypt = require('../../infra/crypt.js')

const password = 'helloworld'

describe('Infra/Crypt', function() {
	process.env.BCRYPT_ROUNDS=10
	let hash = ''

	describe('createPassword proper', function() {
		it('Should create a hash from a given password ', async function() {
			hash = await Crypt.createPassword(password)
			expect(hash).to.be.a('string')
		})
	})
	describe('comparePassword proper ', function() {
		it('Should match the password successfully ', async function() {
			expect(await Crypt.comparePassword(password, hash)).to.be.true
		})
	})
	describe('comparePassword fail ', function() {
		it("Should not match the password ", async function() {
			expect(await Crypt.comparePassword('wrongpassword', hash)).to.be.false
		})
	})
	delete process.env.BCRYPT_ROUNDS
})