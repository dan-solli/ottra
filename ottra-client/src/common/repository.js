import JwtService from "@/common/jwt.service"

import axios from "axios";
import * as AxiosLogger from 'axios-logger'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
// const baseDomain = "https://192.168.1.200:8081";


const instance = axios.create({
	baseURL: 'https://192.168.1.200:8080/api/1',
	timeout: 10000,
})
instance.interceptors.request.use(getLiveToken, AxiosLogger.errorLogger)
//instance.interceptors.request.use(AxiosLogger.requestLogger, AxiosLogger.errorLogger)
//instance.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger)

const refreshAuthLogic = function(failedRequest) {
	console.debug("%s: The failed request is: %O", __filename, failedRequest)
	return instance.post('/auth/token', { 
		refreshToken: JwtService.getRefreshToken() 
	})
	.then(tokenRefreshResponse => {
		failedRequest.response.config.headers['Authentication'] = 
			'Token ' + tokenRefreshResponse.data.token
		JwtService.saveToken(tokenRefreshResponse.data.token)
	})
}

createAuthRefreshInterceptor(instance, refreshAuthLogic, { statusCodes: [ 401, 403 ] } )

function getLiveToken(config) {
	const token = JwtService.getToken()

	console.log("Repository.Interceptor: Fetching token: " + token)

	if (token != null) // eslint-disable-line
		config.headers.Authorization = `Token ${token}`

	return config
}



export default instance