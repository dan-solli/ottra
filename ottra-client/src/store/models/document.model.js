import { Model } from '@vuex-orm/core'

export default class Document extends Model {
	static entity = 'document'

	static fields() {
		return {
			uuid: this.attr(null),
			name: this.string(''),
			filename: this.string('')
		}
	}
}