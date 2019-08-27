const axios = require('axios')
const apiBase = 'http://192.168.1.200:8081/api/1'

function createUser(payload) {
	return axios.post(apiBase + "/auth", payload)
}


module.exports = {
	authenticateUser: function(payload) {
		return axios.post(apiBase + "/auth/authenticate", payload)
	},
	setAuthToken: function(token)	{
		axios.default.headers = {
			Authorization: 'token ' + token
		}
	},
	createAuthenticatedUser: function(payload) {
		const instance = axios.create({
			baseURL: apiBase,
			timeout: 3000,
		})
		return createUser(payload)
		.then(function(user) {
			instance.defaults.headers.common['Authorization'] = 'token ' + user.accessToken
			return {
				user: user,
				request: instance
			}
		})
		.catch(function(err) {
			throw new Error(err)
		})
	},
	createUser: createUser,
}

