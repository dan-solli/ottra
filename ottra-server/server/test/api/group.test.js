/* eslint-env mocha */

const { clearTestData } = require('./../helpers/db.helper')

const chai = require('chai')
const should = chai.should()

describe("Group", function() {
	it("should create a group ")
/*
		, function() {
		return axios.post(apiBase + "/group", defaultGroup).then(res => {
			res.data.name.should.equal(defaultGroup.groupName)
			res.data.creator.should.equal(storage.uuid)
		})
*/		
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

