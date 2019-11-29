<template>
	<div>
	  <v-expansion-panel-header>
	  	<v-container>
	  		<v-row>
	  			<v-col cols="1">
	  				<OttraStepState :step-state="localStep.saveState"></OttraStepState>
	  				<v-icon>mdi-bell-sleep</v-icon>
	  			</v-col>
	  			<v-col cols="8">
				    {{ localStep.title || '<(*) New pause>' }}
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

	  		<v-row>	<!-- Duration -->
	  			<v-col v-if="editMode">
	  				<OttraDateTimePicker 
	  					time-only
	  					:time="localStep.duration"
	  					time-hint="(*) Pause length"
	  					time-label="(*) Pause length"
	  					v-on:set-time="localStep.duration = $event">
	  				</OttraDateTimePicker>
	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.duration }} 
	  			</v-col>
	  		</v-row>

	  		<v-row> <!-- Visual Aid Images -->
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

	  		<v-row> <!-- Documents -->
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

	  		<v-row v-if="editMode"> <!-- Action button -->
	  			<v-col>
	  				<v-btn text @click="saveStep">
	  					(*) Save 
	  				</v-btn>
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

export default {
	name: 'ottra-pause-step',
	props: [ 'thisStep', 'editMode', 'stepOrder' ],
	components: {
		OttraDateTimePicker,
		OttraStepState
	},
	data: function() {
		return {
			localStep: {}
		}
	},
	created() {
		this.localStep = Object.assign({}, this.thisStep)
	},
	methods: {
		saveStep: function() {
			console.debug("%s: saveStep, payload is: %O", __filename, this.localStep)
			this.$store.dispatch("saveStep", this.localStep)
		}
	}
}

</script>	