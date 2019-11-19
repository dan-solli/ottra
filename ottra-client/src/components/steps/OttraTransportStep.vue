<template>
	<div>
	  <v-expansion-panel-header>
	  	<v-container>
	  		<v-row no-gutters>
	  			<v-col cols="1">
	  				<OttraStepState :step-state="localStep.saveState"></OttraStepState>
	  				<v-icon>{{ localStep.method.icon || 'mdi-train-car' }}</v-icon>
	  			</v-col>
	  			<v-col cols="5">
				    {{ localStep.destination.text || '<(*) New transport>' }}
	  			</v-col>
	  			<v-col cols="3">
	  				{{ localStep.method.text }}
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
		          v-model="localStep.title" 
		          label="(*) Title" 
		          type="text"
		          prepend-icon="mdi-page-layout-header" 
		          required>
		        </v-text-field>
			  	</v-col>
			  	<v-col v-else>
				    {{ localStep.title }}
			  	</v-col>
			  </v-row>

	  		<v-row>
	  			<v-col v-if="editMode">
		        <v-textarea
		          v-model="localStep.description"
		          prepend-icon="mdi-comment"
		          outlined
		          hint="(*) Describe the step here"
		          label="(*) Description">
		        </v-textarea>
	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.description }} 
	  			</v-col>
	  		</v-row>

	  		<v-row v-if="stepOptions.includes('useDestination')">
	  			<v-col v-if="editMode">
		        <v-select
		          v-model="localStep.destination"
		          prepend-icon="mdi-map-marker-question-outline"
		          outlined
		          :items="destinationItems"
		          return-object
		          label="(*) Destination">
		        </v-select>

	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.destination }} 
	  			</v-col>
	  		</v-row>

	  		<v-row v-if="stepOptions.includes('useMethod')">
	  			<v-col v-if="editMode">
		        <v-select
		          v-model="localStep.method"
		          prepend-icon="mdi-train-car"
		          outlined
		          :items="transportItems"
		          return-object
		          label="(*) Means of transport">
		        </v-select>

	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.method }} 
	  			</v-col>
	  		</v-row>

	  		<v-row v-if="stepOptions.includes('useDuration')">	<!-- Duration -->
	  			<v-col v-if="editMode">
	  				<OttraDateTimePicker 
	  					time-only
	  					:time="localStep.duration"
	  					time-label="(*) Transport time (will be calculated)"
	  					v-on:set-time="localStep.duration = $event">
	  				</OttraDateTimePicker>
	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.duration }} 
	  			</v-col>
	  		</v-row>

	  		<v-row v-if="stepOptions.includes('useVisualAid')"> <!-- Visual Aid Images -->
	  			<v-col v-if="editMode">
              <v-file-input 
                v-model="localStep.visualAidImages"
                prepend-icon="mdi-tooltip-image-outline"
                chips multiple
                :label="$t('ui.text.uploadfile')"
                v-on:change="">
               </v-file-input>

	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.visualAidImages }} 
	  			</v-col>
	  		</v-row>

	  		<v-row v-if="stepOptions.includes('useDocuments')"> <!-- Documents -->
	  			<v-col v-if="editMode">
              <v-file-input 
                v-model="localStep.documents"
                prepend-icon="mdi-file-document-box-multiple-outline"
                chips multiple
                :label="$t('ui.text.uploadfile')"
                v-on:change="">
               </v-file-input>

	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.documents }} 
	  			</v-col>
	  		</v-row>

	  	</v-container>
	  </v-expansion-panel-content>

	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import OttraDateTimePicker from '@/components/OttraDateTimePicker'
import OttraStepState from '@/components/OttraStepState'
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
	name: 'ottra-transport-step',
	props: [ 'thisStep', 'editMode' ],
	components: {
		OttraDateTimePicker,
		OttraStepState
	},
	data: function() {
		return {
			isExpanded: false,
			stepOptions: [],
			localStep: {
				destination: '',
				method: '',
				duration: '',
			},
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
		this.localStep = Object.assign(this.localStep, this.thisStep)
	}
}

</script>	