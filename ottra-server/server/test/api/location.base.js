const axios = require('axios')
const apiBase = 'http://192.168.1.200:8081/api/1/location'
// const uuidv4 = require('uuid/v4')

const { deleteUserByName, closeDatabaseConnection } = require('./../helpers/db.helper.js')

const result = require('dotenv').config()
if (result.error) {
	console.error("Failed to parse configuration file")
}

module.exports = {
	createLocation: async function(payload) {
		return await axios.post(apiBase, payload)
	},
	updateLocation: async function(payload) {
		return await axios.patch(apiBase, payload)
	},
	getLocation: async function(payload) {
		return await axios.get(apiBase + "/:uuid", payload)
	},
 	getLocations: async function() {
 		return await axios.get(apiBase)
	},
	deleteLocation: async function(payload) {
		return await axios.delete(apiBase + "/:uuid", payload)
	},
	deleteLocationUser: async function(payload) {
		return await deleteUserByName(payload.username)
	},
	completeTearDown: function() {
		closeDatabaseConnection()
	}

}