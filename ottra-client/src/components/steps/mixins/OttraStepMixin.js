import OttraStepState from '@/components/OttraStepState'
import OttraStepMenu from '@/components/steps/subcomponents/OttraStepMenu'

export const OttraStepMixin = {
	props: {
		value: Object,
		step_position: {
			type: Number,
			default: -1
		},
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
			console.debug("%s: emitting 'dirty' event", __filename)
			this.$emit('dirty', false)
			console.debug("%s: Pushing add_steps_to_task to router. Task-uuid is: %s", __filename, this.task_uuid)
			this.$router.push({ 
				name: 'add_steps_to_task', 
				params: {
					task_uuid: this.task_uuid
				}
			})
		},
		removeStep: function() {
			console.debug("%s: removeStep called", __filename)
			this.$store.dispatch("removeStep", {
				task_uuid: this.task_uuid,
				step_uuid: this.value.uuid,
				step_position: this.step_position,
			})
		},
		editStep: function() {
			console.debug("%s: editStep called", __filename)
			this.$router.push({
				name: 'edit_step', 
				params: {
					task_uuid: this.task_uuid,
					step_uuid: this.value.uuid
				}
			})
		},
		moveUp: function() {
			console.debug("%s: moveUp called", __filename)
			this.$store.dispatch("moveStepUp", {
				task_uuid: this.task_uuid,
				step_uuid: this.value.uuid,
				step_position: this.step_position,
			})
		},
		moveDown: function() {
			console.debug("%s: moveDown called", __filename)
			this.$store.dispatch("moveStepDown", {
				task_uuid: this.task_uuid,
				step_uuid: this.value.uuid,
				step_position: this.step_position,
			})
		}
	},
	components: {
		OttraStepState,
		OttraStepMenu,
	},	
}