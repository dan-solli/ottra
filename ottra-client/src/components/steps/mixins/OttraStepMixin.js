import OttraStepState from '@/components/OttraStepState'
import OttraStepMenu from '@/components/steps/subcomponents/OttraStepMenu'

export const OttraStepMixin = {
	props: [ 'value', 'task_uuid' ],
	data: function () { 
		return {
			hasEdits: false
		}
	},
	methods: {
		updateValue: function(key, val) {
			try {
				this.$store.dispatch("updateStepValue", {
					step_uuid: this.value.uuid,
					key: key,
					val: val 
				})
				this.$emit('dirty', true)
			}
			catch (err) {
				console.error("%s: updateValue(%s, %O) failed: %s", __filename, key, val, err)
			}
		},
		saveStep: function() {
			console.debug("%s: saveStep, payload is: %O", __filename, this.value)
			this.$store.dispatch("updateStep", this.value)
			this.$emit('dirty', false)
			//this.$router.go(-1)
		},
		deleteThisStep: function() {
			console.debug("%s: deleteThisStep called", __filename)
			this.$store.dispatch("deleteStep", this.value.uuid)
		},
	},
	components: {
		OttraStepState,
		OttraStepMenu,
	},	
}