/* eslint-env mocha */

const { clearTestData } = require('./../helpers/db.helper')

const chai = require('chai')
const should = chai.should()

describe("Message", function() { 
	it("should create a new message ")
	it("should fail creating a new message with params missing")
	it("should fetch all messages ")
/*
	, function() {
		return axios.get(apiBase + "/message").then(res => {
			res.data.should.be.an('array', "so what is it?")
			res.data.should.have.lengthOf.within(1, 5)
		})
	})
*/	
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
