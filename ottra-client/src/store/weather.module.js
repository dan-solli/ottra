import ApiService from "@/common/api.service";

const state = {
  location_weather: {},
  errors: {}
};

const getters = {
  getAllWeather(state) {
    return state.location_weather;
  }
};

const actions = {
  getWeather({ context, city_id }) {
    // Finns city_id hämtat?
      // JA - Finns det väder för city_id?
        // JA - Är vädret i city_id nyligen hämtat?
          // JA - Returnera befintligt väder
          // NEJ - Hämta och lagra väder.
        // NEJ - Hämta och lagra väder. 
      // NEJ - Hämta och lagra väder.


    if (city_id in location_weather) {
      if ('last_timestamp' in location_weather[city_id]) {
        let right_now = new Date().valueOf();
        if (location_weather[city_id][last_timestamp] + 3600 < right_now) 
        {
          return ApiService.get("weather", { city_id : city_id })
            .then(({ data }) => {
              context.commit('saveWeather', data);
              return data;
          })
            .catch(() => {
              console.log("No bueno")
          });
        }
        else {
          return location_weather[city_id];
        }
      }
    }
  }
};

const mutations = {
  saveWeather(state, data) {
    state.location_weather[data.id] = data
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
