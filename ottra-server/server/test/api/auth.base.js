const axios = require('axios')
const apiBase = 'http://192.168.1.200:8081/api/1'

module.exports = {
	createUser: async function(payload) {
		return await axios.post(apiBase + "/auth", payload)
	},
	authenticateUser: async function(payload) {
		return await axios.post(apiBase + "/auth/authenticate", payload)
	},
	setAuthToken: function(token) {
		axios.default.headers = {
			Authorization: 'token ' + token
		}
	}
}