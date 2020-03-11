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
			<v-col v-if="editMode">
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

		<v-row v-if="stepOptions.includes('useDestination')">
			<v-col v-if="editMode">
        <v-select
	        :value="value.destination" 
	        @input="val => { updateValue('destination', val) }"
          prepend-icon="mdi-map-marker-question-outline"
          outlined
          :items="destinationItems"
          return-object
          label="(*) Destination">
        </v-select>

			</v-col>
			<v-col v-else>
		    {{ value.destination }} 
			</v-col>
		</v-row>

		<v-row v-if="stepOptions.includes('useMethod')">
			<v-col v-if="editMode">
        <v-select
 	        :value="value.method" 
	        @input="val => { updateValue('method', val) }"
          prepend-icon="mdi-train-car"
          outlined
          :items="transportItems"
          return-object
          label="(*) Means of transport">
        </v-select>

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
					time-label="(*) Transport time (will be calculated)">
				</OttraTimePicker>
			</v-col>
			<v-col v-else>
		    {{ value.duration }} 
			</v-col>
		</v-row>

		<v-row v-if="stepOptions.includes('useVisualAid')"> <!-- Visual Aid Images -->
			<v-col cols="5" v-if="editMode">
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

import OttraTimePicker from '@/components/OttraTimePicker'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'
import OttraStepState from '@/components/OttraStepState'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'

import {
	TRANSPORT_BY_FOOT,
	TRANSPORT_BY_BUS,
	TRANSPORT_BY_CAR,
	TRANSPORT_BY_TRAIN,
	TRANSPORT_BY_PLANE,
	TRANSPORT_BY_BICYCLE,
	TRANSPORT_BY_OTHER
} from '@/common/transport.types'

export default {
	name: 'ottra-transport-step-content',
	mixins: [ OttraStepMixin ],
	props: [ 'value'  ],
	components: {
		OttraTimePicker,
		OttraDocumentBrowser,
		OttraStepState
	},
	data: function() {
		return {
			stepOptions: [],
			transportItems: [
				{ text: '(*) By foot', value: this.TRANSPORT_BY_FOOT, icon: 'mdi-walk' },
				{ text: '(*) By bus', value: this.TRANSPORT_BY_BUS, icon: 'mdi-bus' },
				{ text: '(*) By car', value: this.TRANSPORT_BY_CAR, icon: 'mdi-car' },
				{ text: '(*) By train', value: this.TRANSPORT_BY_TRAIN, icon: 'mdi-train' },
				{ text: '(*) By plane', value: this.TRANSPORT_BY_PLANE, icon: 'mdi-airplane' },
				{ text: '(*) By bicycle', value: this.TRANSPORT_BY_BICYCLE, icon: 'mdi-bike' },
				{ text: '(*) By other means', value: this.TRANSPORT_BY_OTHER, icon: 'mdi-crosshairs-question' },
			],
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