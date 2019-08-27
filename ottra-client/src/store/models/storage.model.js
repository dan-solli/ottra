import { Model } from '@vuex-orm/core'

import Equipment from './equipment.model'
import Action from './action.model'
import Document from './document.model'

export default class Storage extends Model {
	static entity = 'storage'

	static fields() {
		return {
			uuid: this.attr(null),
			name: this.string(''),
			storage: this.hasMany(Storage, 'uuid'),
			equipment: this.hasMany(Equipment, 'uuid'),
			action: this.hasMany(Action, 'uuid'),
			document: this.hasMany(Document, 'uuid')
		}
	}
}