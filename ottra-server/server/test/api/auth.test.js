/* eslint-env mocha */

const { deleteUserByName, closeDatabaseConnection } = require('./../helpers/db.helper')
const { createUser, authenticateUser, setAuthToken } = require('./auth.base')

const chai = require('chai')

chai.should()

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
		//console.debug("------> Running before()")
		return Promise.resolve(deleteUserByName(defaultUser.username))
	})

	it("should create user ", function() {
		return createUser(defaultUser)
		.then(function(result) {
			result.status.should.equal(200)
			result.data.uuid.should.be.a('string')
			result.data.accessToken.should.be.a('string')
			result.data.refreshToken.should.be.a('string')
			result.data.username.should.equal(defaultUser.username)
		})
	})
	it("should not be able to recreate the same user ", function() {
		return createUser(defaultUser)
		.catch(function(err) {
			err.response.status.should.equal(403)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('User already exist')
			err.response.data.code.should.equal(403)
		})
	})

	it("should be able to login the created user ", function() {
		return authenticateUser(defaultUser)
		.then(function(result) {
			result.data.username.should.equal(defaultUser.username)
			result.data.uuid.should.be.a('string')
			result.data.accessToken.should.be.a('string')
			result.data.refreshToken.should.be.a('string')
			setAuthToken(result.data.accessToken)
		})
	})
	it("should fail on wrong password", function() {
		return authenticateUser(userWithWrongPassword)
		.catch(function(err) {
			err.response.status.should.equal(401)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(401)
		})
	})

	it("should fail on non-existing user", function() {
		return authenticateUser(noSuchUser)
		.catch(function(err) {
			err.response.status.should.equal(401)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(401)
		})
	})

	it("should fail trying to create user with empty parameters", function() {
		return createUser({})
		.catch(function(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(422)
		})
	})

	it("should fail trying to authenticate user with empty parameters", function() {
		return authenticateUser({})
		.catch(function(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.code.should.equal(422)
		})
	})
	it("should refresh tokens at request ")

	after('End tests. Clearing database from testdata.', function() {
		//console.debug("<----- Running after()")
		return Promise.resolve(deleteUserByName(defaultUser.username).then(function() {
			closeDatabaseConnection()
		}))
	})	
})
