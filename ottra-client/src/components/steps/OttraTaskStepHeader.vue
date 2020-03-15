<template>
	<v-container>
		<v-row>
			<v-col cols="1">
				<OttraStepState v-model="value.saveState"></OttraStepState>
				<v-icon>mdi-clipboard-list-outline</v-icon>
			</v-col>
			<v-col cols="8">
		    {{ showSubject || '<(*) New task>' }}
			</v-col>
			<v-col cols="3">
				{{ showTaskDuration }} 
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import OttraStepState from '@/components/OttraStepState'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

export default {
	name: 'ottra-task-step-header',
	mixins: [ OttraStepMixin ],
	props: [ 'value' ],
	components: {
		OttraStepState
	},
	computed: {
		...mapGetters([ 
			"getTaskDuration",
			"getTaskById"
		]),
		showTaskDuration: function() {
			return this.getTaskDuration(this.value.task)
		},
		showSubject: function() {
			if (this.value.task.length > 0) {
				return this.getTaskById(this.value.task).subject
			} else {
				return 0
			}
		}
	}
}

</script>	