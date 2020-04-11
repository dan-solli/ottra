<template>
	<v-container>
		<v-row>
			<v-col cols="2">
				<OttraStepMenu
					@delete-step="deleteThisStep"
					v-model="value.editMode">
				</OttraStepMenu>
				<OttraStepState 
					v-model="value.saveState">
				</OttraStepState>
				<v-icon>mdi-format-list-checkbox</v-icon>
			</v-col>
			<v-col cols="4">
		    {{ value.title || '<(*) New step>' }}
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
			if (this.value.hasOwnProperty('stepLocation')) {
				const loc = this.value.stepLocation

				if (loc != '') {
					return this.getRoomByID(loc).name || ''
				}
			}
			return ''
		},
		getColor: function() {
			return this.getThumbColor(this.value.energyExpense)
		},		
	}
}

</script>
