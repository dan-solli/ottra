import Vue from "vue";
import Vuex from "vuex";

import UIState from "./ui/navigation_drawer"
import User from "./user"
import UserSettings from "./user/user.settings"

import Location from "./location/location"
import Room from "./location/room"
import Storage from "./location/storage"

import Event from './event'
import Message from './message'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
		Event,
		Location,
		Message,
		Room,
		Storage,
		UIState,
		User,
		UserSettings
  },
});
