import { Model } from '@vuex-orm/core'

export default class Geolocation extends Model {
	static entity = 'geolocation'

	static fields() {
		return {
			uuid: this.attr(null),
			latitude: this.number(0),
			longitude: this.number(0)
		}
	}
}