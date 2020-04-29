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
				<OttraStepState 
					v-model="value.saveState">
				</OttraStepState>
				<v-icon>mdi-bell-sleep</v-icon>
			</v-col>
			<v-col cols="7">
		    {{ value.title || '<(*) New pause>' }}
			</v-col>
			<v-col cols="3">
				{{ value.duration }}
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

export default {
	name: 'ottra-pause-step-header',
	mixins: [ OttraStepMixin ],
}

</script>	