import OttraStepState from '@/components/OttraStepState'
import OttraStepMenu from '@/components/steps/subcomponents/OttraStepMenu'

export const OttraStepMixin = {
	props: {
		value: Object,
		task_uuid: String,
		editMode: {
			type: Boolean,
			default: false
		}
	},
	data: function () { 
		return {
			hasEdits: false,
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
		updateStep: function() {
			console.debug("%s: updateStep, payload is: %O", __filename, this.value)
			this.$store.dispatch("updateStep", this.value)
			this.$emit('dirty', false)
			//this.$router.go(-1)
		},
		removeStep: function() {
			console.debug("%s: removeStep called", __filename)
			this.$store.dispatch("removeStep", {
				task_uuid: this.task_uuid,
				step_uuid: this.value.uuid
			})
		},
	},
	components: {
		OttraStepState,
		OttraStepMenu,
	},	
}