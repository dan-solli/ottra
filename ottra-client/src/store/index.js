import Vue from "vue";
import Vuex from "vuex";
//import VuexORM from '@vuex-orm/core'
//import VuexORMAxios from '@vuex-orm/plugin-axios'

import UIState from "./ui/navigation_drawer"

// You're fired!
//import UIFileBrowser from "./ui/file_browser"

import User from "./user"
import UserSettings from "./user/user.settings"

import Location from "./location/location"
import Room from "./location/room"
import Storage from "./location/storage"

import Event from './event'
import Message from './message'

import Document from './document'
import Todo from './todo'

import Equipment from './equipment'

import Step from './step'
import Task from './task'

//import TaskExternal from './task.external'
//import TaskInternal from './task.internal'
//import StepExternal from './step.external'
//import StepInternal from './step.internal'

import Relation from './relations'

/*
import ActionModel from '@/store/models/action.model'
import AddressModel from '@/store/models/address.model'
// import DocumentModel from '@/store/models/document.model'
import EquipmentModel from '@/store/models/equipment.model'
import GeolocationModel from '@/store/models/geolocation.model'
import LocationModel from '@/store/models/location.model'
import RoomModel from '@/store/models/room.model'
import StorageModel from '@/store/models/storage.model'
//import UserModel from '@/store/models/user.model'
*/ 

Vue.use(Vuex);

/*
const database = new VuexORM.Database()

database.register(ActionModel)
database.register(AddressModel)
// database.register(DocumentModel)
database.register(EquipmentModel)
database.register(GeolocationModel)
database.register(LocationModel)
database.register(RoomModel)
database.register(StorageModel)
//database.register(UserModel)

VuexORM.use(VuexORMAxios, {
	database,
	http: {
		baseURL: 'http://192.168.1.200',
		url: '/api/1',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}
})
*/ 

const OttraStore = new Vuex.Store({
  modules: {
  	Document,
  	Equipment,
		Event,
		Location,
		Message,
		Relation,
		Room,
		Step,
//		StepExternal,
//		StepInternal,
		Storage,
//		TaskExternal,
//		TaskInternal,
		Task,
		Todo,
//		UIFileBrowser,
		UIState,
		User,
		UserSettings
  },
//  plugins: [VuexORM.install(database)]
});

/*
const unsubscribeFunc = OttraStore.subscribe((mutation, state) => {
	if (['ADD_EQUIPMENT', 'ADD_STORAGE'].includes(mutation.type)) {
		console.debug("%s: Vuex Subscription hit by type %s and payload %O", 
			__filename, mutation.type, mutation.payload)
	}
})
*/

export default OttraStore