<template>
	<v-container>
		<v-row no-gutters>
			<v-col cols="2">
				<OttraStepMenu
					v-on:edit-step="editStep"
					v-on:move-up="moveUp"
					v-on:move-down="moveDown"
					v-on:remove-step="removeStep"
					:step_position="step_position"
					v-model="editMode">
				</OttraStepMenu>
				<v-icon>{{ getTransportIcon(value.method) || 'mdi-train-car' }}</v-icon>
			</v-col>
			<v-col cols="4">
		    {{ getTransportText(value.method) || '<(*) New transport>' }}
			</v-col>
			<v-col cols="3">
				{{ getLocationByID(value.destination).name || '' }}
			</v-col>
			<v-col cols="3">
				{{ value.duration }}
			</v-col>
		</v-row>
	</v-container>
</template>

<script>

import { mapGetters } from 'vuex'

import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'
import { OttraTransportMixin } from '@/components/steps/mixins/OttraTransportMixin'

export default {
	name: 'ottra-transport-step-header',
	mixins: [ OttraStepMixin, OttraTransportMixin ],
	computed: {
		...mapGetters([ 
			"getLocationByID",
		])
	}
}

</script>	