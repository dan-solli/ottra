const WeatherModel = require('./../models/weather.model')

const { 
	WEATHER_FULL, 
	WEATHER_FORECAST3, 
	WEATHER_SMALL 
} = require('./../infra/types/weather_fetch.types')

const Weather = require('openweather-apis')
Weather.setLang('en')
Weather.setUnits('metric') // This will not change for anyone! (maybe)
Weather.setAPPID(process.env.OWM_APIKEY)

const WeatherService = {
	getWeather: async function(weatherType, lat_or_city_id, long = null) {
		// Are we being called with coordinates or a city_id

		// Should we ever be called with uuid or something else that's weird?
		// That day, that sorrow.
		if (long !== null) {
			Weather.setCoordinate(lat_or_city_id, long)
		} else {
			Weather.setCityId(lat_or_city_id)
		}

		if (weatherType === WEATHER_FULL) {
			return await fetchFullWeather(Weather)
		} else if (weatherType === WEATHER_FORECAST3) {
			return await fetchForecastWeather(Weather)
		} else if (weatherType === WEATHER_SMALL) {
			return await fetchSmallWeather(Weather)
		}
	}
}

async function fetchForecastWeather(weatherClient) {
	return new Promise(function(resolve, reject) {
		weatherClient.getWeatherForecastForDays(3, function(err, obj) {
			if (!err) {
				resolve({ ok: true, data: obj })
			} else {
				reject({ ok: false, error: { code: 404, status: 'failed', message: err }})
			}
		})
	})
}

async function fetchFullWeather(weatherClient) {
	return new Promise(function(resolve, reject) {
		weatherClient.getAllWeather(function(err, obj) {
			if (!err) {
				resolve({ ok: true, data: obj })
			} else {
				reject({ ok: false, error: { code: 404, status: 'failed', message: err }})
			}
		}) 
	})
}

async function fetchSmallWeather(weatherClient) {
	return new Promise(function(resolve, reject) {
		weatherClient.getSmartJSON(function(err, obj) {
			if (!err) {
				resolve({ ok: true, data: obj })
			} else {
				reject({ ok: false, error: { code: 404, status: 'failed', message: err }})
			}
		}) 
	})
}


module.exports = WeatherService