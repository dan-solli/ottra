const axios = require('axios')
const apiBase = 'http://192.168.1.200:8081/api/1/location'
const authBase = 'http://192.168.1.200:8081/api/1/auth'

const { 
	deleteUserByName, 
	closeDatabaseConnection 
} = require('./../helpers/db.helper.js')

var accessToken = null

function createUser(payload) {
	return axios.post(authBase, payload)
		.then(function(response) {
			accessToken = response.data.accessToken
		})
}

axios.interceptors.request.use(function(config) {
	if (accessToken != null) {
		config.headers.Authorization = `Token ${accessToken}`
	}
	return config
})

module.exports = {
	createUser: createUser,
	createLocation: function(payload) {
		return axios.post(apiBase, payload)
	},
	updateLocation: function(payload) {
		return axios.patch(apiBase, payload)
	},
	getLocation: function(payload) {
		return axios.get(apiBase + "/:uuid", payload)
	},
 	getLocations: function() {
 		return axios.get(apiBase)
	},
	deleteLocation: function(payload) {
		return axios.delete(apiBase + "/:uuid", payload)
	}
}