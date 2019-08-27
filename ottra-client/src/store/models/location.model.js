import { Model } from '@vuex-orm/core'

import Room from './room.model'
import Geolocation from './geolocation.model'
import Address from './address.model'

export default class Location extends Model {
	static entity = 'location'

	static fields() {
		return {
			uuid: this.attr(null),
			name: this.string(''),
			rooms: this.hasMany(Room, 'uuid'),
			geolocation: this.hasOne(Geolocation, 'uuid'),
			address: this.hasOne(Address, 'uuid')
		}
	}
}