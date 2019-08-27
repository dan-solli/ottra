import { Model } from '@vuex-orm/core'

import Action from './action.model'
import Document from './document.model'

export default class Equipment extends Model {
	static entity = 'equipment'

	static fields() {
		return {
			uuid: this.attr(null),
			name: this.string(''),
			action: this.hasMany(Action, 'uuid'),
			document: this.hasMany(Document, 'uuid')
		}
	}
}