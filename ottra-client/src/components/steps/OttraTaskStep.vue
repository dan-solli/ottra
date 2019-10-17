<template>
	<div>
	  <v-expansion-panel-header>
	  	<v-container>
	  		<v-row>
	  			<v-col cols="1">
	  				<OttraStepState :step-state="localStep.saveState"></OttraStepState>
	  				<v-icon>mdi-clipboard-list-outline</v-icon>
	  			</v-col>
	  			<v-col cols="8">
				    {{ localStep.task.body || '<(*) New task>' }}
	  			</v-col>
	  			<v-col cols="3">
	  				{{ localStep.duration }}
	  			</v-col>
	  		</v-row>
	  	</v-container>
	  </v-expansion-panel-header>

	  <v-expansion-panel-content>
	  	<v-container>

	  		<v-row>
	  			<v-col v-if="editMode">
		        <v-select
		          v-model="localStep.task_uuid"
		          prepend-icon="mdi-clipboard-list-outline"
		          outlined
		          :items="taskItems"
		          return-object
		          label="(*) Task">
		        </v-select>

	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.description }} 
	  			</v-col>
	  		</v-row>


	  	</v-container>
	  </v-expansion-panel-content>

	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import OttraStepState from '@/components/OttraStepState'

export default {
	name: 'ottra-task-step',
	props: [ 'thisStep', 'editMode' ],
	components: {
		OttraStepState
	},
	data: function() {
		return {
			localStep: {
				task_uuid: '',
				task: {},
			},
		}
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
	created() {
		this.localStep = Object.assign(this.localStep, this.thisStep)
	}
}

</script>	