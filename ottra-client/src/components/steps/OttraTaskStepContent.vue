<template>
	<v-container>
		<v-row>
			<v-col v-if="editMode">
        <v-autocomplete
        	:value="value.task"
	        @input="val => { updateValue('task', val) }"
          prepend-icon="mdi-clipboard-list-outline"
          outlined
          :items="taskItems"
          :label="$t('ui.component.task.heading')">
        </v-autocomplete>

			</v-col>
			<v-col v-else>
		    {{ value.task }} 
			</v-col>
		</v-row>

		<v-row> <!-- Visual Aid Images -->
			<v-col cols="5" v-if="editMode">
	      <v-text-field 
	        :value="attachmentUUIDToFilename(value.visualAidImages)" 
	        @input="val => { updateValue('visualAidImages', val) }"
	        :label="$t('ui.component.step.visualaidimageslabel')" 
	        type="text"
	        disabled
	        append-icon="mdi-iframe-variable-outline" 
	        prepend-icon="mdi-tooltip-image-outline" 
	        required>
	      </v-text-field>
	    </v-col>
	    <v-col cols="1">

	      <OttraDocumentBrowser 
	      	:value="value.visualAidImages"
	        @input="val => { updateValue('visualAidImages', val) }">
	      </OttraDocumentBrowser>
	    </v-col>

		</v-row>


		<v-row v-if="editMode"> <!-- Action button -->
			<v-col>
				<v-btn text @click="updateStep">
					{{ $t('ui.text.save') }} 
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import OttraStepState from '@/components/OttraStepState'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'
import { DocumentMixin } from '@/views/creation/mixins/DocumentUUIDToFilename'

export default {
	name: 'ottra-task-step-content',
	mixins: [ 
		OttraStepMixin,
		DocumentMixin
 	],
	props: [ 'value' ],
	components: {
		OttraStepState,
		OttraDocumentBrowser
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