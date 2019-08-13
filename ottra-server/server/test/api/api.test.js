const result = require('dotenv').config({ path: '/home/dsi/projects/ottra/ottra-server/server/.env' })
if (result.error) {
	console.error("Failed to parse configuration file")
}

const Neo4J = require('neo4j-driver').v1
const Connection = Neo4J.driver(process.env.NEO4J_URL, 
																Neo4J.auth.basic(process.env.NEO4J_USERNAME, 
																								process.env.NEO4J_PASSWORD), {
																	disableLosslessIntegers: true
																}
															)

const chai = require('chai')
const should = chai.should()
const express = require('express')

const defaultUser = { username: 'testsson@testinge.se', password: 'ettpassord'}
const defaultGroup = { groupName: 'Testgroup 01' }

const axios = require('axios')

const apiBase = 'http://192.168.1.200:8081/api/1'

let storage = {
	accessToken: '',
	uuid: ''
}

describe("API", () => {

	before('Starting up tests. Clearing database from testdata.', function() {
		clearTestData()
	})

	describe("Auth", () => {

		it("should create user ", () => {
			return axios.post(apiBase + "/auth", defaultUser)
			.then(res => {
				res.status.should.equal(200)
				res.data.uuid.should.be.a('string')
				res.data.username.should.equal(defaultUser.username)

				storage.uuid = res.data.uuid
			})
		})
		it("should not be able to recreate the same user ", () => {
			return axios.post(apiBase + "/auth", defaultUser).then(res => {
				// foo
			}).catch(function(err) {
				// console.log(err)
				err.response.status.should.equal(403)
				err.response.data.status.should.equal('failed')
				err.response.data.message.should.equal('User already exist')
				err.response.data.code.should.equal(403)
			})
		})
		it("should be able to login the created user ", () => {
			return axios.post(apiBase + "/auth/authenticate", defaultUser).then(res => {
				res.data.username.should.equal(defaultUser.username)
				res.data.uuid.should.be.a('string')
				res.data.accessToken.should.be.a('string')
				res.data.refreshToken.should.be.a('string')

				axios.defaults.headers = {
					Authorization: 'token ' + res.data.accessToken
				}
			})
		})
		it("should fail on wrong password", () => {
			return axios.post(apiBase + "/auth/authenticate", { 
				username: defaultUser.username, 
				password: 'wrongpassword'
			}).then(res => {
				// foo
			}).catch(function(err) {
				err.response.status.should.equal(401)
				err.response.data.status.should.equal('failed')
				err.response.data.code.should.equal(401)
			})
		})
		it("should fail on non-existing user", () => {
			return axios.post(apiBase + "/auth/authenticate", {
				username: "notregistereduser@nowhere.com",
				password: "thisisrandom"
			}).then(res => {
				console.log(res.status)
				console.log(res.data)
			}).catch(function(err) {
				err.response.status.should.equal(401)
				err.response.data.status.should.equal('failed')
				err.response.data.code.should.equal(401)
			})
		})
		it("should fail trying to create user with empty parameters", () => {
			return axios.post(apiBase + "/auth/authenticate", { }).then(res => {
				console.log(res.status)
				console.log(res.data)
			}).catch(function(err) {
				err.response.status.should.equal(422)
				err.response.data.status.should.equal('failed')
				err.response.data.code.should.equal(422)
			})
		})
		it("should fail trying to authenticate user with empty parameters", () => {
			return axios.post(apiBase + "/auth/authenticate", { }).then(res => {
				console.log(res.status)
				console.log(res.data)
			}).catch(function(err) {
				err.response.status.should.equal(422)
				err.response.data.status.should.equal('failed')
				err.response.data.code.should.equal(422)
			})
		})
		it("should refresh tokens at request ")
	})

	describe("Geography", () => { 
		it("(perma-skip due to cost) should look up predictions for an address when asked ")
		it("(perma-skip due to cost) should find the Google Place for an address ")
	})

	describe("Group", () => {
		it("should create a group ", () => {
			return axios.post(apiBase + "/group", defaultGroup).then(res => {
				res.data.name.should.equal(defaultGroup.groupName)
				res.data.creator.should.equal(storage.uuid)
			})
		})
		it("should fail to create a group with data missing")
		it("should edit a groups properties")
		it("should accept an invite and add a member to a group ")
		it("should remove a member from a group ")
		it("should fetch all groups for a user ")
		it("should send an invite to a group to a certain user ")
		it("should fail to send an invite to an unknown user ")
		it("should withdraw an invitation")
		it("should change the role of a member of a group")
		it("should change the permissions of a member of a group")
	})
	describe("Message", () => { 
		it("should create a new message ")
		it("should fail creating a new message with params missing")
		it("should fetch all messages ", () => {
			return axios.get(apiBase + "/message").then(res => {
				res.data.should.be.an('array', "so what is it?")
				res.data.should.have.lengthOf.within(1, 5)
			})
		})
		it("should fetch a single message")
		it("should not return a message if there is none with that id")
		it("should delete a message ")
		it("should not delete a message if there is an id missing")
		it("should snooze a message ")
		it("should fail snoozing a message if there is no id")
		it("should archive a message ")
		it("should not archive a message with random id")
		it("should not archive a message not owned by the user")
	})


	after('End tests. Clearing database from testdata.', function() {
		clearTestData()
	})
})

function clearTestData() {
	const session = Connection.session()

	session.run(`MATCH (u:User { username: {username} }) DETACH DELETE u`, 
		{ username: defaultUser.username })
	.then(function() {
		// foo
	})
	session.run(` MATCH (g:Group { name: {groupname} })	DETACH DELETE g`, 
		{ groupname: defaultGroup.groupName })
	.then(function() {
		Connection.close()
	})
}