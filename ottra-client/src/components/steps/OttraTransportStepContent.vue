<template>
	<v-container>
		<v-row>
			<v-col cols="12">
		  	<v-toolbar>
	  			<v-btn-toggle multiple dense borderless v-model="stepOptions">
	  				<v-tooltip bottom v-for="button in buttons" :key="button.icon">
	  					<template v-slot:activator="{ on }">
	  						<v-btn @click.native.stop v-on="on" :value="button.value">
	  							<v-icon right> {{ button.icon }} </v-icon>
	  						</v-btn>
	  					</template>
	  					<span> {{ button.tooltip }} </span>
	  				</v-tooltip>
	  			</v-btn-toggle>
	  		</v-toolbar>
	  	</v-col>
	  </v-row>

		<v-row>
	  	<v-col v-if="editMode">
        <v-text-field 
	        :value="value.title" 
	        @input="val => { updateValue('title', val) }"
          :label="$t('ui.text.title')" 
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
			<v-col v-if="editMode">
        <v-textarea
	        :value="value.description" 
	        @input="val => { updateValue('description', val) }"
          prepend-icon="mdi-comment"
          outlined
          :hint="$t('ui.component.step.descriptionhint')"
          :label="$t('ui.component.step.descriptionlabel')">
        </v-textarea>
			</v-col>
			<v-col v-else>
		    {{ value.description }} 
			</v-col>
		</v-row>

		<v-row v-if="stepOptions.includes('useDestination')">
			<v-col v-if="editMode">
        <v-autocomplete
	        :value="value.destination" 
	        @input="val => { updateValue('destination', val) }"
          prepend-icon="mdi-map-marker-question-outline"
          outlined
          :items="destinationItems"
          :label="$t('ui.component.step.destinationlabel')">
        </v-autocomplete>

			</v-col>
			<v-col v-else>
		    {{ value.destination }} 
			</v-col>
		</v-row>

		<v-row v-if="stepOptions.includes('useMethod')">
			<v-col v-if="editMode">
        <v-autocomplete
 	        :value="value.method" 
	        @input="val => { updateValue('method', val) }"
          prepend-icon="mdi-train-car"
          outlined
          :items="transportItems"
          :label="$t('ui.component.step.transportmethod')">
        </v-autocomplete>

			</v-col>
			<v-col v-else>
		    {{ value.method }} 
			</v-col>
		</v-row>

		<v-row v-if="stepOptions.includes('useDuration')">	<!-- Duration -->
			<v-col v-if="editMode">
				<OttraTimePicker 
					:value="value.duration"
	        @input="val => { updateValue('duration', val) }"
					:time-label="$t('ui.component.step.transporttime')">
				</OttraTimePicker>
			</v-col>
			<v-col v-else>
		    {{ value.duration }} 
			</v-col>
		</v-row>

		<v-row v-if="stepOptions.includes('useVisualAid')"> <!-- Visual Aid Images -->
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

import OttraTimePicker from '@/components/OttraTimePicker'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'
import OttraStepState from '@/components/OttraStepState'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

import { DocumentMixin } from '@/views/creation/mixins/DocumentUUIDToFilename'

import {
	TRANSPORT_BY_FOOT,
	TRANSPORT_BY_BUS,
	TRANSPORT_BY_CAR,
	TRANSPORT_BY_TRAIN,
	TRANSPORT_BY_PLANE,
	TRANSPORT_BY_BICYCLE,
	TRANSPORT_BY_OTHER,
	OttraTransportMixin
} from '@/components/steps/mixins/OttraTransportMixin'

export default {
	name: 'ottra-transport-step-content',
	mixins: [ OttraStepMixin, OttraTransportMixin, DocumentMixin ],
	props: [ 'value'  ],
	components: {
		OttraTimePicker,
		OttraDocumentBrowser,
		OttraStepState
	},
	data: function() {
		return {
			stepOptions: [],
			// The stuff below is deprecated and won't be translated.
			buttons: [
				{
					icon: "mdi-map-marker-question-outline",
					value: "useDestination",
					tooltip: "(*) Destination"			  				
				}, 
				{
					icon: "mdi-train-car",
					value: "useMethod",
					tooltip: "(*) Method"			  				
				}, 
				{
					icon: "mdi-clock-outline",
					value: "useDuration",
					tooltip: "(*) Duration"			  				
				}, 
				{
					icon: "mdi-tooltip-image-outline",
					value: "useVisualAid",
					tooltip: "(*) Visual Aid"			  				
				}, 
				{
					icon: "mdi-file-document-box-multiple-outline",
					value: "useDocuments",
					tooltip: "(*) Documents"			  				
				}, 
			]
		}
	},
	computed: {
		...mapGetters([
			"getLocations"
		]),
		destinationItems: function() {
			return Object.values(this.getLocations).map(function(loc) {
				return { 
					text: loc.name,
					value: loc.uuid
				}
			}) 
		}
	},
	created() {
		this.$store.dispatch("loadLocations")
	},
}

</script>	