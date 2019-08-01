import JwtService from "@/common/jwt.service"

import axios from "axios";
import * as AxiosLogger from 'axios-logger'

// const baseDomain = "https://192.168.1.200:8081";

const instance = axios.create({
	baseURL: 'https://192.168.1.200:8080/api/1',
	timeout: 10000,
})
instance.interceptors.request.use(getLiveToken, AxiosLogger.requestLogger, AxiosLogger.errorLogger)
instance.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger)

function getLiveToken(config) {
	const token = JwtService.getToken()

	console.log("Repository.Interceptor: Fetching token: " + token)

	if (token != null)
		config.headers.Authorization = `Token ${token}`

	return config
}

export default instance