export const OttraEffortMixin = {
	data: function() {
		return {
			tickLabels: [
				"(*) Återhämtning",
				"(*) Nollsumma",
				"(*) Ansträngande",
				"(*) Tröttande",
				"(*) Utmattande"
			],
		}
	},	
	methods: {
		getTickLabel: function(value) {
			if (value < 0 || value >= this.tickLabels.length) {
				console.error("%s: getTickLabel(%d) is out of bounds", __filename, value)
				return "(*) Error: Out of bounds"
			}
			else {
				return this.tickLabels[value]
			}
		},
		getThumbColor: function(value) {
			const colors = [ "blue","green","yellow","orange","red"	]

			if (value < 0 || value >= colors.length) {
				console.error("%s: getThumbColor(%d) is out of bounds", __filename, value)
				return "(*) Error: Out of bounds"
			}
			else {
				return colors[value]
			}
		}
	}
}