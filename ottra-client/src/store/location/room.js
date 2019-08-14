import Vue from 'vue'
//import Vuex from 'vuex'

/*
import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const RoomRepo = RepositoryFactory.get('room')
*/

const Room = {
	state: {
    rooms : {
      "Room01": { 
        "uuid": "Room01",
        "Name": "Soprummet",
        "Storages": [
          "Storage01",
          "Storage02",
          "Storage03",
          "Storage04",
          "Storage05",
          "Storage06"
        ]
      },
      "Room02":
      {
        "uuid": "Room02",
        "Name": "Sovrum"          
      },
      "Room03":
      {
        "uuid": "Room03",
        "Name": "Badrum"          
      },
      "Room04":
      {
        "uuid": "Room04",
        "Name": "Duschrum"          
      },
      "Room05":
      {
        "uuid": "Room05",
        "Name": "Pysselrum"         
      },
      "Room06":
      {
        "uuid": "Room06",
        "Name": "Kök",
        "Storages": [
          "Storage07"
        ]
      },
      "Room07":
      {
        "uuid": "Room07",
        "Name": "Teas rum"          
      },
      "Room08":
      {
        "uuid": "Room08",
        "Name": "Klädkammare",
        "Storages": [
          "Storage08"
        ]
      },
      "Room09":
      {
        "uuid": "Room09",
        "Name": "Förråd"          
      },
      "Room10":
      {
        "uuid": "Room10",
        "Name": "Hall",         
        "Storages": [
          "Storage09",
          "Storage10",
          "Storage11"
        ]
      }
    }
	},
	mutations: {
	},
	getters: {
    getRooms: state => Object.keys(state.rooms),
    getRoomByID: (state) => (id) => { 
      return state.rooms[id]
    }
	},
	actions: {
	}
}

export default Room