const LocationModel = require('./../models/location.model')
const WeatherService = require('./weather.service')
const PlaceService = require('./place.service')

const { WEATHER_FULL } = require('./../infra/types/weather_fetch.types')

const LocationService = {
	getLocations: async function(user_id) {
		// TODO: Check arguments.
		return await LocationModel.getLocations(user_id)
	},
	createLocation: async function(payload, user_id) {
		try {
			const placeResult = await PlaceService.getPlaceByPlaceId(payload.place_id)
			console.debug("%s: createLocation: placeResult is %O", __filename, placeResult)
			if (placeResult.ok && placeResult.data === null) { // Ok, so it didn't exist, we need to create it, and stuff.
				const weatherResult = await WeatherService.getWeather(WEATHER_FULL, payload.latitude, payload.longitude)
				console.debug("%s: createLocation: weatherResult is %O", __filename, weatherResult)
				if (weatherResult.ok) { // We got proper data
					payload.owm_cityid = '' + weatherResult.data.id
				}
				const newPlaceResult = await PlaceService.createPlace(payload, user_id)
				console.debug("%s: createLocation: newPlaceResult is %O", __filename, newPlaceResult)
				if (newPlaceResult.ok) {
					payload.place_uuid = newPlaceResult.data.uuid
					createLocationResult = await LocationModel.createLocation(payload, user_id)
					console.debug("%s: createLocation returning: %O", __filename, createLocationResult)
					return createLocationResult
				}
			} else {
				payload.place_uuid = placeResult.data.uuid
				createLocationResult = await LocationModel.createLocation(payload, user_id)
				console.debug("%s: createLocation returning: %O", __filename, createLocationResult)
				return createLocationResult
			}
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'failed', message: err } }
		}
	}
}

module.exports = LocationService

