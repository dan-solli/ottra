export const OttraStepMixin = {
	methods: {
		updateValue: function(key, val) {
			this.$emit("input", { ...this.value, [key]: val })
		},
		saveStep: function() {
			console.debug("%s: saveStep, payload is: %O", __filename, this.localStep)
			this.$store.dispatch("saveStep", this.localStep)
		}		
	}
}