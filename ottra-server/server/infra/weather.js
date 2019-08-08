const { Weather } = require('openweathermap-apis')

export default class WeatherClient {
	constructor(api_key) {
		this.apiKey = api_key
		this.weatherClient = new Weather({
			apiKey: this.apiKey
		})
	}
}