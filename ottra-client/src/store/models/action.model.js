import { Model } from '@vuex-orm/core'

import Document from './document.model'

export default class Action extends Model {
	static entity = 'action'

	static fields() {
		return {
			uuid: this.attr(null),
			name: this.string(''),
			document: this.hasMany(Document, 'uuid')
		}
	}
}