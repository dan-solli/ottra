/* eslint-env mocha */

const { 
	deleteUserByName, 
	closeDatabaseConnection 
} = require('./../helpers/db.helper')

const {
	createUser, 
	createLocation,
	updateLocation,
	getLocation,
	getLocations,
	deleteLocation
} = require('./location.base')

const chai = require('chai')

chai.should()

const locationUser = {
	username: "testlocationuser@test.se",
	password: "zePassword"
}

const fullLocation = {
	geolocation: {
		latitude: 10.01,
		longitude: 11.01,
		omwCityID: 3
	},
	address: {
		street: 'Västra Vägen 60',
		postalCode: '85236',
		city: 'Sundsvall',
		country: 'Sweden',
		googlePlaceID: 'XXXXXXXXXXXX'
	},
	name: 'Hemma (test)'
}

const brokenLocationNoAddress = {
	geolocation: {
		latitude: 12.01,
		longitude: 13.01,
		omwCityID: 2
	},
	name: 'Hemma (test2)'
}

const brokenLocationNoGeolocation = {
	address: {
		street: 'Västra Vägen 60',
		postalCode: '85236',
		city: 'Sundsvall',
		country: 'Sweden',
		googlePlaceID: 'XXXXXXXXXXXX'
	},
	name: 'Hemma (test)'
}

const brokenLocationMissingName = {
	geolocation: {
		latitude: 14.01,
		longitude: 15.01,
		omwCityID: 1
	},
	address: {
		street: 'Västra Vägen 64',
		postalCode: '85236',
		city: 'Sundsvall',
		country: 'Sweden',
		googlePlaceID: 'XXXXXXXXXXXX'
	},
}

const notMyLocation = {
	geolocation: {
		latitude: 17.01,
		longitude: 19.01,
		omwCityID: 3
	},
	address: {
		street: 'Västra Vägen 71',
		postalCode: '85236',
		city: 'Sundsvall',
		country: 'Sweden',
		googlePlaceID: 'XXXXXXXXXXXX'
	},
	name: 'Hemma (test - updated by groupAuthorization)'
}

const updatedLocation = {
	geolocation: {
		latitude: 10.01,
		longitude: 11.01,
		omwCityID: 3
	},
	address: {
		street: 'Västra Vägen 69',
		postalCode: '85236',
		city: 'Sundsvall',
		country: 'Norway',
		googlePlaceID: 'XXXXXXXXXXXX'
	},
	name: 'Hemma (test - updated)'
}

/*
describe("Location", function() {

	before("Starting up tests. Clearing database from testdata and create local user", function() {
		return Promise.resolve(deleteUserByName(locationUser.username)
			.then(function() {
				return createUser(locationUser).then(function(response) { 
					console.debug("%s: Response from creating user: %O", __filename, response)
				})
			})
		)
	})

	it("should create a location ", function() {
		return createLocation(fullLocation)
		.then(function(result) {
			result.status.should.equal(200)
			result.data.uuid.should.be.a('string')
			// Should be complete tests here, for each and every field.
		})
	})
	it("should fail to create a location (missing address) ", function() {
		return createLocation(brokenLocationNoAddress)
		.catch(function(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Mandatory address is missing')
			err.response.data.code.should.equal(422)
		})
	})
	it("should fail to create a location (missing geolocation) ", function() {
		return createLocation(brokenLocationNoGeolocation)
		.catch(function(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Mandatory geolocation is missing')
			err.response.data.code.should.equal(422)
		})
	})
	it("should fail to create a location (missing name) ", function() {
		return createLocation(brokenLocationMissingName)
		.catch(function(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Mandatory name is missing')
			err.response.data.code.should.equal(422)
		})
	})
	it("should get all locations (for that user) ", function() {
		return getLocations()
		.then(function(result) {
			result.status.should.equal(200)
			// Should be complete tests here, for each and every field.
		})
	})
	it("should get a specific location ", function() {
		return getLocation('uuid')
		.then(function(result) {
			result.status.should.equal(200)
			// Should be complete tests here, for each and every field.
		})
	})
	it("should fail to get a specific location (missing uuid)", function() {
		return getLocation('not-a-uuid')
		.catch(function(err) {
			err.response.status.should.equal(404)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Location not found')
			err.response.data.code.should.equal(404)
		})
	})
	it("should update the name of a location ", function() {
		return updateLocation('uuid', updatedLocation)
		.then(function(result) {
			result.status.should.equal(200)
			// Should be complete tests here, for each and every field.
		})
	})
	it("should fail update the name of a location (bad uuid)", function() {
		return updateLocation(brokenLocationMissingName)
		.catch(function(err) {
			err.response.status.should.equal(404)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Location not found')
			err.response.data.code.should.equal(404)
		})
	})
	it("should fail update the name of a location (not your location!)", function() {
		return updateLocation(brokenLocationMissingName)
		.catch(function(err) {
			err.response.status.should.equal(404)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Location not found')
			err.response.data.code.should.equal(404)
		})
	})
	it("should update the name of a location (not your location - but within group)", function() {
		return updateLocation('uuid', notMyLocation)
		.then(function(result) {
			result.status.should.equal(200)
			// Should be complete tests here, for each and every field.
		})
	})
	it("should fail update the name of a location (not authorized!)", function() {
		return updateLocation(brokenLocationMissingName)
		.catch(function(err) {
			err.response.status.should.equal(403)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('You are not authorized to change that location')
			err.response.data.code.should.equal(403)
		})
	})
	it("should remove a location ", function() {
		return deleteLocation('uuid')
		.then(function(result) {
			result.status.should.equal(200)
			// Should be complete tests here, for each and every field.
		})
	})
	it("should fail to remove a location (bad uuid)", function() {
		return deleteLocation('not-a-uuid')
		.catch(function(err) {
			err.response.status.should.equal(422)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Mandatory name is missing')
			err.response.data.code.should.equal(422)
		})
	})
	it("should fail to remove a location (not your location!)", function() {
		return deleteLocation(brokenLocationMissingName)
		.catch(function(err) {
			err.response.status.should.equal(404)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('Location not found')
			err.response.data.code.should.equal(404)
		})
	})
	it("should fail to remove a location (groups location, but not within your rights)", function() {
		return createLocation(brokenLocationMissingName)
		.catch(function(err) {
			err.response.status.should.equal(403)
			err.response.data.status.should.equal('failed')
			err.response.data.message.should.equal('You are not authorized to remove that location')
			err.response.data.code.should.equal(403)
		})
	})
	
	after("Closing down tests. Teardown database", function() {
		return Promise.resolve(deleteUserByName(locationUser.username).then(function() {
			closeDatabaseConnection()
		}))
	})	
})
*/


/*

describe("Room", function() {
	it("should create a room ")
	it("should fail to create a room ")
	it("get all rooms (for that user and location) ")
	it("get a specific room ")
	it("update the name of a room ")
	it("remove a room ")
})

describe("Storage", function() {
	it("should create a storage ")
	it("should fail to create a storage ")
	it("get all storages (for that user and room) ")
	it("get a specific storage ")
	it("update the name of a storage ")
	it("remove a storage ")
})
*/
