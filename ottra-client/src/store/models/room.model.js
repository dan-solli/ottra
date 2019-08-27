import { Model } from '@vuex-orm/core'

import Storage from './storage.model'
import Document from './document.model'

export default class Room extends Model {
	static entity = 'room'

	static fields() {
		return {
			uuid: this.attr(null),
			name: this.string(''),
			storage: this.hasMany(Storage, 'uuid'),
			document: this.hasMany(Document, 'uuid')
		}
	}
}