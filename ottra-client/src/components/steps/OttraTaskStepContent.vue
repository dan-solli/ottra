<template>
	<v-container>
		<v-row>
			<v-col v-if="editMode">
        <v-select
        	:value="value.task.uuid"
	        @input="val => { updateValue('title', val) }"
          prepend-icon="mdi-clipboard-list-outline"
          outlined
          :items="taskItems"
          return-object
          label="(*) Task">
        </v-select>

			</v-col>
			<v-col v-else>
		    {{ value.task.uuid }} 
			</v-col>
		</v-row>

		<v-row v-if="editMode"> <!-- Action button -->
			<v-col>
				<v-btn text @click="saveStep">
					(*) Save 
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import OttraStepState from '@/components/OttraStepState'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

export default {
	name: 'ottra-task-step-content',
	mixins: [ OttraStepMixin ],
	props: [ 'value' ],
	components: {
		OttraStepState
	},
	computed: {
		...mapGetters([
			"getTasks"
		]),
		taskItems: function() {
			return Object.values(this.getTasks).map(function(task) {
				return { 
					text: task.subject,
					value: task.uuid,
					taskData: task
				}
			}) 
		}
	},
}

</script>	