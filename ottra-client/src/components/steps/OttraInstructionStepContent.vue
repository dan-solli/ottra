<template>
	<v-container>
		<v-row>
	  	<v-col v-if="editMode">
	      <v-text-field 
	        :value="value.title" 
	        @input="val => { updateValue('title', val) }"
	        :label="$t('ui.text.title')" 
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
			<v-col v-if="editMode">
	      <v-textarea
	        :value="value.description" 
	        @input="val => { updateValue('description', val) }"
	        prepend-icon="mdi-comment"
	        append-icon="mdi-iframe-variable-outline" 
	        outlined
	        :hint="$t('ui.component.step.descriptionhint')"
	        :label="$t('ui.component.step.descriptionlabel')"
	      </v-textarea>
			</v-col>
			<v-col v-else>
		    {{ value.description }} 
			</v-col>
		</v-row>

	  <v-row>
	    <v-col v-if="editMode">
	    	<OttraOptionalStep 
	    		:value="value.optionalStep"
	        @input="val => { updateValue('optionalStep', val) }">
    		</OttraOptionalStep>
	    </v-col>

	  </v-row>

		<v-row> <!-- What room -->
			<v-col v-if="editMode">
		    <v-autocomplete
	        :value="value.stepLocation" 
	        @input="val => { updateValue('stepLocation', val) }"
		    	prepend-icon="mdi-floor-plan"
		      :label="$t('ui.component.step.steplocationlabel')"
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
			<v-col v-if="editMode">
				<OttraTimePicker 
					:value="value.duration"
	        @input="val => { updateValue('duration', val) }"
					:time-hint="$t('ui.text.duration')"
					:time-label="$t('ui.text.duration')">
				</OttraTimePicker>
			</v-col>
			<v-col v-else>
		    {{ value.duration }} 
			</v-col>
		</v-row>

		<v-row> <!-- Energy Expense. -->
			<v-col v-if="editMode">
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
			<v-col v-if="editMode">
		    <v-autocomplete
	        :value="value.tools" 
	        @input="val => { updateValue('tools', val) }"
		    	prepend-icon="mdi-hammer"
		      :label="$t('ui.component.step.requiredtoolslabel')"
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

		<v-row v-if="editMode"> 

	    <v-col cols="5">
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

	    <v-col cols="5">
	      <v-text-field 
	        :value="attachmentUUIDToFilename(value.attachments)" 
	        @input="val => { updateValue('attachments', val) }"
	        :label="$t('ui.component.step.attachmentslabel')" 
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

import { OttraEffortMixin } from '@/components/steps/mixins/OttraEffortMixin'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'
import { DocumentMixin } from '@/views/creation/mixins/DocumentUUIDToFilename'

import OttraTimePicker from '@/components/OttraTimePicker'
import OttraStepState from '@/components/OttraStepState'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'
import OttraOptionalStep from '@/components/steps/subcomponents/OttraOptionalStep'
import OttraEffortSlider from '@/components/steps/subcomponents/OttraEffortSlider'

export default {
	name: 'ottra-instruction-step-content',
	props: [ 'value' ],
	mixins: [ 
		OttraStepMixin, 
		OttraEffortMixin, 
		DocumentMixin 
	],
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
	mounted() {
		this.$store.dispatch("loadRooms")
		this.$store.dispatch("loadEquipment")
	}
}
</script>