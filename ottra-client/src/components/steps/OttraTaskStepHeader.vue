<template>
	<v-container>
		<v-row>
			<v-col cols="1">
				<OttraStepState v-model="value.saveState"></OttraStepState>
				<v-icon>mdi-clipboard-list-outline</v-icon>
			</v-col>
			<v-col cols="8">
		    {{ value.task.body || '<(*) New task>' }}
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
	name: 'ottra-task-step-header',
	mixins: [ OttraStepMixin ],
	props: [ 'value' ],
	components: {
		OttraStepState
	},
}

</script>	