/* eslint-env mocha */

const result = require('dotenv').config({ path: '/home/dsi/projects/ottra/ottra-server/server/.env' })
if (result.error) {
	console.error("Failed to parse configuration file")
}

const expect = require('chai').expect

const Crypt = require('../../infra/crypt.js')

const password = 'helloworld'

describe('Infra/Crypt', function() {
	let hash = ''

	it('Should create a hash from a given password ', async function() {
		hash = await Crypt.createPassword(password)
		expect(hash).to.be.a('string')
	})
	it('Should match the password successfully ', async function() {
		expect(await Crypt.comparePassword(password, hash)).to.be.true
	})
	it("Should not match the password ", async function() {
		expect(await Crypt.comparePassword('wrongpassword', hash)).to.be.false
	})
})