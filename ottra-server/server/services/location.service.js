const LocationModel = require('./../models/location.model')
const WeatherService = require('./weather.service')

const { WEATHER_FULL } = require('./../infra/types/weather_fetch.types')

const LocationService = {
	getLocations: async function(user_id) {
		return await LocationModel.getLocations(user_id)
	},
	getLocation: async function(user_id, loc_id) {
		return await LocationModel.getLocation(user_id, loc_id)
	},
	createLocation: async function(payload, user_id) {
		try {
			const weatherResult = await WeatherService.getWeather(WEATHER_FULL, payload.latitude, payload.longitude)
			console.debug("%s: createLocation: weatherResult is %O", __filename, weatherResult)
			if (weatherResult.ok) { // We got proper data
				payload.owm_cityid = '' + weatherResult.data.id
			}

			const accessEquipment = payload.accessEquipment
			delete payload.accessEquipment

			const createLocationResult = await LocationModel.createLocation(payload, user_id)

			accessEquipment.forEach(async function (eq_uuid) {
				await LocationModel.createAccessKey(createLocationResult.data.uuid, eq_uuid)
			})

			console.debug("%s: createLocation returning: %O", __filename, createLocationResult)
			return createLocationResult
		}
		catch (err) {
			return { ok: false, error: { code: 422, status: 'service failed', message: err } }
		}
	},
	deleteLocation: async function(payload, user_id) {
		console.debug("%s: deleteLocation got body: %O", __filename, payload)
		return await LocationModel.deleteLocation(user_id, payload.uuid)
	}
}

module.exports = LocationService
