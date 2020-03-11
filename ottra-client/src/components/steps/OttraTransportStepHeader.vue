<template>
	<v-container>
		<v-row no-gutters>
			<v-col cols="1">
				<OttraStepState v-model="value.saveState"></OttraStepState>
				<v-icon>{{ value.method.icon || 'mdi-train-car' }}</v-icon>
			</v-col>
			<v-col cols="5">
		    {{ value.destination.text || '<(*) New transport>' }}
			</v-col>
			<v-col cols="3">
				{{ value.method.text }}
			</v-col>
			<v-col cols="3">
				{{ value.duration }}
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import OttraStepState from '@/components/OttraStepState'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

export default {
	name: 'ottra-transport-step-header',
	mixins: [ OttraStepMixin ],
	props: [ 'value' ],
	components: {
		OttraStepState
	},
}

</script>	