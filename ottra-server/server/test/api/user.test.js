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

const axios = require('axios')

const apiBase = 'http://192.168.1.200:8081/api/1'

describe("API", () => {

	before('Starting up tests. Clearing database from testdata.', function() {
		clearTestData()
	})

	describe("Auth", () => {

		it("should create user ", () => {
			return axios.post(apiBase + "/auth", defaultUser).then(res => {
				res.status.should.equal(200)
				res.data.id.should.be.a('string')
				res.data.username.should.equal(defaultUser.username)
			})
		})
		it("should not be able to recreate the same user ", () => {
			return axios.post(apiBase + "/auth", defaultUser).then(res => {
				// console.log(res)
				res.status.should.equal(403)
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
				//console.log(res)
				res.data.username.should.equal(defaultUser.username)
				res.data.id.should.be.a('string')
				res.data.accessToken.should.be.a('string')
				res.data.refreshToken.should.be.a('string')

				axios.defaults.headers = {
					Authorization: 'token ' + res.data.accessToken
				}
			})
		})
		it("should refresh tokens at request ")
	})

	describe("Geography", () => { 
		it("should look up predictions for an address when asked ")
		it("should find the Google Place for an address ")
	})

	describe("Group", () => {
		it("should create a group ")
		it("should fail to create a group with data missing")
		it("should edit a groups properties")
		it("should accept an invite and add a member to a group ")
		it("should remove a member from a group ")
		it("should fetch all groups for a user ")
		it("should send an invite to a group to a certain user ")
		it("should fail to send an invite to an unknown user ")
		it("should withdraw an invitation" )
		it("should change the role of a member of a group" )
		it("should change the permissions of a member of a group" )
	})

	describe("Message", () => { 
		it("should create a new message ")
		it("should fetch all messages ")
		it("should fetch a single message")
		it("should delete a message ")
		it("should snooze a message ")
		it("should archive a message ")
	})

	after('End tests. Clearing database from testdata.', function() {
		clearTestData()
	})
})

function clearTestData() {
	const session = Connection.session()

	session.run("MATCH (u:User { username: {username} }) DETACH DELETE u", 
		{ username: defaultUser.username })
	.then(function() {
		Connection.close()
	})
}