<template>
	<v-container>
		<v-row>
			<v-col cols="1">
				<OttraStepState v-model="value.saveState"></OttraStepState>
				<v-icon>mdi-format-list-checkbox</v-icon>
			</v-col>
			<v-col cols="5">
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
import { mapGetters } from 'vuex'

import { OttraEffortMixin } from '@/components/steps/mixins/OttraEffortMixin'
import OttraStepState from '@/components/OttraStepState'

export default {
	name: 'ottra-instruction-step-header',
	props: [ 'value' ],
	mixins: [ OttraEffortMixin ],
	components: {
		OttraStepState
	},
	computed: {
		...mapGetters([
			"getRooms"
		]),
		getRoomName: function() {
			if (this.value.hasOwnProperty('stepLocation')) {
				const loc = this.value.stepLocation

				if (loc != '') {
					const rooms = this.getRooms
					if (Object.values(rooms).length) {
						return rooms[loc].name || ''
					}
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
