import Vue from "vue";
import Vuex from "vuex";
//import VuexORM from '@vuex-orm/core'
//import VuexORMAxios from '@vuex-orm/plugin-axios'

import UIState from "./ui/navigation_drawer"
import User from "./user"
import UserSettings from "./user/user.settings"

import Location from "./location/location"
import Room from "./location/room"
import Storage from "./location/storage"

import Event from './event'
import Message from './message'

import Document from './document'
import Todo from './todo'

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

export default new Vuex.Store({
  modules: {
  	Document,
		Event,
		Location,
		Message,
		Room,
		Storage,
		Todo,
		UIState,
		User,
		UserSettings
  },
//  plugins: [VuexORM.install(database)]
});
