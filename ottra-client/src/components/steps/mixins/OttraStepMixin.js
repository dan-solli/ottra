import { mapGetters, mapActions } from 'vuex'
import OttraStepState from '@/components/OttraStepState'
import OttraStepMenu from '@/components/steps/subcomponents/OttraStepMenu'

export const OttraStepMixin = {
/*
	data: function() {
		return {
			step: {}
		}
	},
*/	
	props: [ 'value' ],
	methods: {
		updateValue: function(key, val) {
			try {
				// console.debug("%s: updateValue called with key: %s and value: %O", __filename, key, val)
				//this.$set(this.step, key, val)
				this.$store.dispatch("updateStep", {
					step_uuid: this.value.uuid,
					key: key,
					val: val 
				})
			}
			catch (err) {
				console.error("%s: updateValue(%s, %O) failed: %s", key, val, err)
			}
			//this.$emit("input", { ...this.value, [key]: val })
		},
		saveStep: function() {
			console.debug("%s: saveStep, payload is: %O", __filename, this.value)
			this.$store.dispatch("saveStep", this.value)
		}		
	},
	components: {
		OttraStepState,
		OttraStepMenu,
	},	
/*	
	computed: {
		...mapGetters([
			"getTaskById",
			"getStepById"
		]),
		...mapActions([

		]),
	},
  async mounted() {
    await this.$store.dispatch("loadTasks")
    if (this.value) {
      this.step = Object.assign({}, this.getStepById(this.value))
    } 
	}
*/
}