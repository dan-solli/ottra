import OttraStepState from '@/components/OttraStepState'
import OttraStepMenu from '@/components/steps/subcomponents/OttraStepMenu'

export const OttraStepMixin = {
	props: [ 'value' ],
	methods: {
		updateValue: function(key, val) {
			try {
				this.$store.dispatch("updateStep", {
					step_uuid: this.value.uuid,
					key: key,
					val: val 
				})
			}
			catch (err) {
				console.error("%s: updateValue(%s, %O) failed: %s", key, val, err)
			}
		},
		saveStep: function() {
			console.debug("%s: saveStep, payload is: %O", __filename, this.value)
			this.$store.dispatch("saveStep", this.value)
			//this.$router.go(-1)
		},
		deleteThisStep: function() {
			console.debug("%s: deleteThisStep called", __filename)
			this.$store.dispatch("deleteStep", this.value.uuid)
		}
	},
	components: {
		OttraStepState,
		OttraStepMenu,
	},	
}