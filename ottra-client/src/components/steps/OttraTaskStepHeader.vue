<template>
	<v-container>
		<v-row>
			<v-col cols="2">
				<OttraStepMenu
					v-on:edit-step="editStep"
					v-on:move-up="moveUp"
					v-on:move-down="moveDown"
					v-on:remove-step="removeStep"
					v-model="editMode">
				</OttraStepMenu>
				<OttraStepState 
					v-model="value.saveState">
				</OttraStepState>
				<v-icon>mdi-clipboard-list-outline</v-icon>
			</v-col>
			<v-col cols="7">
		    {{ showSubject || '<(*) New task>' }}
			</v-col>
			<v-col cols="3">
				{{ showTaskDuration }} 
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

export default {
	name: 'ottra-task-step-header',
	mixins: [ OttraStepMixin ],
	computed: {
		...mapGetters([ 
			"getTaskDuration",
			"getTaskById"
		]),
		showTaskDuration: function() {
			if (!this.value.hasOwnProperty("task")) {
				return ""
			}
			return this.getTaskDuration(this.value.task)
		},
		showSubject: function() {
			if (!this.value.hasOwnProperty("task")) {
				return ""
			}
			return this.getTaskById(this.value.task).subject
		}
	}
}

</script>	