import { Model } from '@vuex-orm/core'

export default class Address extends Model {
	static entity = 'address'

	static fields() {
		return {
			uuid: this.attr(null),
			street: this.string(''),
			postalcode: this.string(''),
			city: this.string(''),
			country: this.string('')
		}
	}
}