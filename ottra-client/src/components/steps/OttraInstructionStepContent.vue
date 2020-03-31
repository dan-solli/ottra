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
	        append-icon="mdi-iframe-variable-outline" 
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
	        append-icon="mdi-iframe-variable-outline" 
	        outlined
	        hint="(*) Describe the step here"
	        label="(*) Description">
	      </v-textarea>
			</v-col>
			<v-col v-else>
		    {{ value.description }} 
			</v-col>
		</v-row>

	  <v-row>
	    <v-col v-if="value.editMode">
	    	<OttraOptionalStep 
	    		:value="value.optionalStep"
	        @input="val => { updateValue('optionalStep', val) }">
    		</OttraOptionalStep>
	    </v-col>

	  </v-row>

		<v-row> <!-- What room -->
			<v-col v-if="value.editMode">
		    <v-autocomplete
	        :value="value.stepLocation" 
	        @input="val => { updateValue('stepLocation', val) }"
		    	prepend-icon="mdi-floor-plan"
		      label="(*) Which room"
		      :items="roomList"
		      item-text="name"
		      item-value="uuid"
		    ></v-autocomplete>
			</v-col>
			<v-col v-else>
		    {{ value.stepLocation }} 
			</v-col>
		</v-row>

		<v-row>	<!-- Duration -->
			<v-col v-if="value.editMode">
				<OttraTimePicker 
					:value="value.duration"
	        @input="val => { updateValue('duration', val) }"
					time-hint="(*) Duration"
					time-label="(*) Duration">
				</OttraTimePicker>
			</v-col>
			<v-col v-else>
		    {{ value.duration }} 
			</v-col>
		</v-row>

		<v-row> <!-- Energy Expense. -->
			<v-col v-if="value.editMode">
				<OttraEffortSlider 
					:value="value.energyExpense"
	        @input="val => { updateValue('energyExpense', val) }"> 
				</OttraEffortSlider>
			</v-col>
	    <v-col v-else>
	    	{{ tickLabels[value.energyExpense] }}
	    </v-col>
			</v-row>

		<v-row>
			<v-col v-if="value.editMode">
		    <v-autocomplete
	        :value="value.tools" 
	        @input="val => { updateValue('tools', val) }"
		    	prepend-icon="mdi-hammer"
		      label="(*) Necessary tools"
		      :items="toolList"
		      item-text="name"
		      item-value="uuid"
		      multiple 
		      chips
		    ></v-autocomplete>
			</v-col>
			<v-col v-else>
		    {{ value.tools }} 
			</v-col>
		</v-row>

		<v-row v-if="value.editMode"> 

	    <v-col cols="5">
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
import { mapGetters } from 'vuex'

import { OttraEffortMixin } from '@/components/steps/mixins/OttraEffortMixin'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

import OttraTimePicker from '@/components/OttraTimePicker'
import OttraStepState from '@/components/OttraStepState'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'
import OttraOptionalStep from '@/components/steps/subcomponents/OttraOptionalStep'
import OttraEffortSlider from '@/components/steps/subcomponents/OttraEffortSlider'

export default {
	name: 'ottra-instruction-step-content',
	props: [ 'value' ],
	mixins: [ OttraStepMixin, OttraEffortMixin ],
	components: {
		OttraTimePicker,
		OttraStepState,
		OttraOptionalStep,
		OttraEffortSlider,
    OttraDocumentBrowser 
	},
	computed: {
		...mapGetters([ 
			"getRooms",
			"getEquipment",
		]),
		roomList: function() {
			return Object.values(this.getRooms)
		},
		toolList: function() {
			return Object.values(this.getEquipment)
		},
	},
}
</script>