import Vue from 'vue'
import Vuex from 'vuex'

/*
import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const RoomRepo = RepositoryFactory.get('room')
*/

const Event = {
	state: {
    events : {
      "Event01":
      {
        type: "calendar#event",
        uuid: "Event01",
        status: '',
        created: '2019-07-21',
        updated: '2019-07-22',
        description: 'Möte annorstädes',
        location: "Loc02",
        creator: 'User01',
        start: {
          date: '2019-07-23',
          dateTime: '14:00:00',
          timeZone: 'CET'
        },
        end: {
          date: '2019-07-23',
          dateTime: '15:00:00',
          timeZone: 'CET'
        },
        attendees: [ 'User02' ],
        reminders: [ 'Rem01', 'Rem02' ],
        options: {
          needTravel: true,
          needPreparation: true
        },
        preparationTasks: [
          "Event02",
          "Event03",
        ],
        energyDischarge: 5 // From 1-5: easy, moderately easy, hard, very hard, exhausting
      },
      "Event02": {
        type: "calendar#task",
        uuid: "Event02",
        status: '',
        created: '2019-07-21',
        updated: '2019-07-22',
        description: 'Ta fram kläder inför morgondagens möte',
        location: "Loc01",
        creator: 'User01',
        start: {
          date: '2019-07-22',
          dateTime: '21:30:00',
          timeZone: 'CET'
        },
        end: {
          date: '2019-07-22',
          dateTime: '21:45:00',
          timeZone: 'CET'
        },
        attendees: null,
        reminders: [ 'Rem03' ],
        options: {
          needTravel: false,
          needPreparation: false
        },
        preparationTasks: [],
        causedEvent: "Event01",
        energyDischarge: 2,
      },
      "Event03": {
        type: "calendar#task",
        uuid: "Event03",
        status: '',
        created: '2019-07-21',
        updated: '2019-07-22',
        description: 'Förbereda avresa inför möte',
        location: "Loc01",
        creator: 'User01',
        start: {
          date: '2019-07-23',
          dateTime: '13:10:00',
          timeZone: 'CET'
        },
        end: {
          date: '2019-07-23',
          dateTime: '13:40:00',
          timeZone: 'CET'
        },
        attendees: null,
        reminders: [ 'Rem03' ],
        options: {
          needTravel: false,
          needPreparation: false
        },
        preparationTasks: [
          "Event02"
        ],
        energyDischarge: 4
      }
    }
	},
	mutations: {
	},
	getters: {
  	getEvents: state => state.events,
    getEventByID: (state) => (id) => { 
      return state.events.id
    },
    todaysDate: state => new Date().toISOString().slice(0, 10)
	},
	actions: {
	}
}

export default Event