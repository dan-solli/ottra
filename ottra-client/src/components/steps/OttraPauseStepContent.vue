<template>
	<v-container>
		<v-row>
	  	<v-col v-if="value.editMode">
        <v-text-field 
	        :value="value.title" 
	        @input="val => { updateValue('title', val) }"
          label="(*) Title" 
          type="text"
          prepend-icon="mdi-page-layout-header"
          required>
        </v-text-field>
	  	</v-col>
	  	<v-col v-else>
		    {{ value.title }}
	  	</v-col>
	  </v-row>

		<v-row>
			<v-col v-if="value.editMode">
        <v-textarea
	        :value="value.description" 
	        @input="val => { updateValue('description', val) }"
          prepend-icon="mdi-comment"
          outlined
          hint="(*) Describe the step here"
          label="(*) Description">
        </v-textarea>
			</v-col>
			<v-col v-else>
		    {{ value.description }} 
			</v-col>
		</v-row>

		<v-row>	<!-- Duration -->
			<v-col v-if="value.editMode">
				<OttraTimePicker
					:value="value.duration"
	        @input="val => { updateValue('duration', val) }"
					time-label="(*) Pause length"
					time-hint="(*) Pause length">
				</OttraTimePicker>
			</v-col>
			<v-col v-else>
		    {{ value.duration }} 
			</v-col>
		</v-row>

		<v-row> <!-- Visual Aid Images -->
			<v-col cols="5" v-if="value.editMode">
	      <v-text-field 
	        :value="value.visualAidImages" 
	        @input="val => { updateValue('visualAidImages', val) }"
	        label="(*) Visual Aid Images" 
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

	    <v-col cols="5">
	      <v-text-field 
	        :value="value.attachments" 
	        @input="val => { updateValue('attachments', val) }"
	        label="(*) Attachments" 
	        type="text"
	        disabled
	        append-icon="mdi-iframe-variable-outline" 
	        prepend-icon="mdi-file-document-box-multiple-outline" 
	        required>
	      </v-text-field>
	    </v-col>
	    <v-col cols="1">
	      <OttraDocumentBrowser
	      	:value="value.attachments"
	        @input="val => { updateValue('attachments', val) }">
	      </OttraDocumentBrowser>
	    </v-col>
		</v-row>


		<v-row v-if="value.editMode"> <!-- Action button -->
			<v-col>
				<v-btn text @click="saveStep">
					(*) Save 
				</v-btn>
			</v-col>
		</v-row>

	</v-container>
</template>

<script>
import OttraTimePicker from '@/components/OttraTimePicker'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

export default {
	name: 'ottra-pause-step-content',
	mixins: [ OttraStepMixin ],
	props: [ 'value' ],
	components: {
		OttraTimePicker,
		OttraDocumentBrowser,
	},
}

</script>	