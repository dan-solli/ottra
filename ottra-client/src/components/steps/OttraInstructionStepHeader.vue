<template>
	<v-container>
		<v-row>
			<v-col cols="2">
				<OttraStepMenu
					v-on:edit-step="editStep"
					v-on:move-up="moveUp"
					v-on:move-down="moveDown"
					v-on:remove-step="removeStep"
					:step_position="step_position"
					v-model="editMode">
				</OttraStepMenu>
				<v-icon>mdi-format-list-checkbox</v-icon>
			</v-col>
			<v-col cols="4">
		    {{ value.title || $t('ui.component.step.newstep') }}
			</v-col>
			<v-col cols="3">
		    {{ getRoomName }}
			</v-col>
			<v-col cols="1">
				{{ value.duration }}
			</v-col>
			<v-col cols="2">
				<div :class="getColor">
					{{ tickLabels[value.energyExpense] }}
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { OttraEffortMixin } from '@/components/steps/mixins/OttraEffortMixin'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

export default {
	name: 'ottra-instruction-step-header',
	mixins: [ OttraEffortMixin, OttraStepMixin ],
	computed: {
		...mapGetters([
			"getRoomByID"
		]),
		getRoomName: function() {
/*			
			if (this.value.hasOwnProperty('stepLocation') && this.value.stepLocation.length > 0)
			const roomObject = this.$store.dispatch("fetchRoom", )
*/

			console.debug("%s: getRoomName is called", __filename)
			if (this.value.hasOwnProperty('stepLocation')) {
				console.debug("%s: Room has a stepLocation", __filename)
				const loc = this.value.stepLocation
				console.debug("%s: And its value is: %s", __filename, loc)

				if (loc != '' && loc != null) {
					return this.getRoomByID(loc).name || ''
				}
			}
			return ''
		},
		getColor: function() {
			return this.getThumbColor(this.value.energyExpense)
		},		
	},
}

</script>
