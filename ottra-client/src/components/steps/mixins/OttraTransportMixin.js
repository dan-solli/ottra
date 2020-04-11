export const TRANSPORT_BY_FOOT = 1
export const TRANSPORT_BY_BUS = 2
export const TRANSPORT_BY_CAR = 3
export const TRANSPORT_BY_TRAIN = 4
export const TRANSPORT_BY_PLANE = 5
export const TRANSPORT_BY_BICYCLE = 6
export const TRANSPORT_BY_OTHER = 7

// TODO: Need to refactor and streamline this shit. 
export const OttraTransportMixin = {
	data: function() {
		return {
			transportItems: [
				{ text: '(*) By foot', value: TRANSPORT_BY_FOOT, icon: 'mdi-walk' },
				{ text: '(*) By bus', value: TRANSPORT_BY_BUS, icon: 'mdi-bus' },
				{ text: '(*) By car', value: TRANSPORT_BY_CAR, icon: 'mdi-car' },
				{ text: '(*) By train', value: TRANSPORT_BY_TRAIN, icon: 'mdi-train' },
				{ text: '(*) By plane', value: TRANSPORT_BY_PLANE, icon: 'mdi-airplane' },
				{ text: '(*) By bicycle', value: TRANSPORT_BY_BICYCLE, icon: 'mdi-bike' },
				{ text: '(*) By other means', value: TRANSPORT_BY_OTHER, icon: 'mdi-crosshairs-question' },
			],
			transportLookup: [
				'',
				'(*) By foot',
				'(*) By bus',
				'(*) By car',
				'(*) By train',
				'(*) By plane',
				'(*) By bicycle',
				'(*) By other means',
			],
			transportIcons: [
				'',
				'mdi-walk',
				'mdi-bus',
				'mdi-car',
				'mdi-train',
				'mdi-airplane',
				'mdi-bike',
				'mdi-crosshairs-question',
			]
		}
	},
	methods: {
		getTransportText: function(transportType) {
			return this.transportLookup[transportType]
		},
		getTransportIcon: function(transportType) {
			return this.transportIcons[transportType]
		}
	}
}