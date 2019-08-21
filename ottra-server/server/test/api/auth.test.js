/* eslint-env mocha */

const { clearTestData } = require('./../helpers/db.helper')
const { createUser, authenticateUser, setAuthToken } = require('./auth.base')

const chai = require('chai')
const should = chai.should()

describe("Auth", function() {

	const defaultUser = {
		username: 'testsson@test.se',
		password: 'ettpassord'
	}
	const userWithWrongPassword = {
		username: 'testsson@test.se',
		password: 'felpassord'
	}
	const noSuchUser = {
		username: 'testsson2@test.se',
		password: 'ingetpassord'
	}

	before('Starting up tests. Clearing database from testdata.', function() {
		clearTestData()
	})

	it("should create user ", async function() {
		try {
			const result = await createUser(defaultUser)
			result.status.should.equal(200)
			result.data.uuid.should.be.a('string')
			result.data.username.should.equal(defaultUser.username)
		}
		catch (err) {
			throw new Error(err)
		} 
	})

	it("should not be able to recreate the same user ", async function() {
		try {
			return await createUser(defaultUser)
		}
		catch(err) {
			err.response.status.should.equal(403)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('User already exist')
			err.response.data.code.should.equal(403)
		}
	})

	it("should be able to login the created user ", async function() {
		try {
			const result = await authenticateUser(defaultUser)
			result.data.username.should.equal(defaultUser.username)
			result.data.uuid.should.be.a('string')
			result.data.accessToken.should.be.a('string')
			result.data.refreshToken.should.be.a('string')

			setAuthToken(result.data.accessToken)
		}
		catch (err) {
			throw new Error(err)
		}
	})

	it("should fail on wrong password", async function() {
		try {
			return await authenticateUser(userWithWrongPassword)
		}
		catch(err) {
			err.response.status.should.equal(401)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(401)
		}
	})

	it("should fail on non-existing user", async function() {
		try {
			return await authenticateUser(noSuchUser)
		}
		catch (err) {
			err.response.status.should.equal(401)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(401)
		}
	})

	it("should fail trying to create user with empty parameters", async function() {
		try {
			return await createUser({})
		}
		catch(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(422)
		}
	})

	it("should fail trying to authenticate user with empty parameters", async function() {
		try {
			return await authenticateUser({})
		}
		catch(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(422)
		}
	})

	it("should refresh tokens at request ")
	
	after('End tests. Clearing database from testdata.', function() {
		clearTestData()
	})	
})
