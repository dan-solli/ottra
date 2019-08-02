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

const refreshAuthLogic = failedRequest => 
	instance.post('/auth/token', { refreshToken: JwtService.getRefreshToken() })
	.then(tokenRefreshResponse => {
		JwtService.saveRefreshToken(tokenRefreshResponse.data.token)
		failedRequest.response.config.headers['Authentication'] = 
			'Token ' + tokenRefreshResponse.data.token
		return Promise.resolve()			
	})

createAuthRefreshInterceptor(instance, refreshAuthLogic)

function getLiveToken(config) {
	const token = JwtService.getToken()

	console.log("Repository.Interceptor: Fetching token: " + token)

	if (token != null)
		config.headers.Authorization = `Token ${token}`

	return config
}



export default instance