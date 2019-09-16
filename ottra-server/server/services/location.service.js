const LocationModel = require('./../models/location.model')
const WeatherService = require('./weather.service')

const { WEATHER_FULL } = require('./../infra/types/weather_fetch.types')

const LocationService = {
	getLocations: async function(user_id) {
		// TODO: Check arguments.
		return await LocationModel.getLocations(user_id)
	},
	createLocation: async function(payload, user_id) {
		try {
			const weatherResult = await WeatherService.getWeather(WEATHER_FULL, payload.latitude, payload.longitude)
			console.debug("%s: createLocation: weatherResult is %O", __filename, weatherResult)
			if (weatherResult.ok) { // We got proper data
				payload.owm_cityid = '' + weatherResult.data.id
			}
			createLocationResult = await LocationModel.createLocation(payload, user_id)
			console.debug("%s: createLocation returning: %O", __filename, createLocationResult)
			return createLocationResult
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	}
}

module.exports = LocationService
