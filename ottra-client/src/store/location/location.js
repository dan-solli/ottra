import Vue from 'vue'
//import Vuex from 'vuex'


import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const LocationRepo = RepositoryFactory.get('location')

const Location = {
	state: {
    locations : {
      "Loc01":
      {
        "uuid": "Loc01",
        "Name": "Soprum",
        "Geolocation": 
        {
          "Latitude": 62.385985,
          "Longitude": 17.3099
        },
        "Address":
        {
          "Street": "Östra Långgatan 7",
          "Postal Code": "85236",
          "City": "Sundsvall",
          "Country": "Sweden"
        },
        "Rooms": [
          "Room01"
        ]
      },
      "Loc02":
      {
        "uuid": "Loc02",
        "Name": "Hemma",
        "Geolocation": 
        {
          "Latitude": 62.385974,
          "Longitude": 17.310661
        },
        "Address": 
        {
          "Street": "Östra Långgatan 7B",
          "Postal Code": "85236",
          "City": "Sundsvall",
          "Country": "Sweden"
        },
        "Rooms":  [
          "Room02",
          "Room03",
          "Room04",
          "Room05",
          "Room06",
          "Room07",
          "Room08",
          "Room09",
          "Room10"
        ]
      }
    }
	},
	mutations: {
    ADD_LOCATION(state, payload) {
      state.locations[payload.uuid] = payload
    }
	},
	getters: {
    getLocations: state => state.locations,
    getLocationByID: (state) => (id) => { 
      return state.locations[id]
    },
	},
	actions: {
    createLocation: async function({ commit }, payload) {
      console.debug("%s: createLocation: Payload is: %O", __filename, payload)
      // Display the key/value pairs

      try {
        const response = await LocationRepo.createLocation(payload)
        commit("ADD_LOCATION", response.data)
      }
      catch (err) {
        Vue.$log.error("store.location.createLocation: Definite failure: " + err)
      }
    }
	}
}

export default Location