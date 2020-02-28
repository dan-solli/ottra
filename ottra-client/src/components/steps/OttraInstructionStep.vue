<template>
	<div>
	  <v-expansion-panel-header>
	  	<v-container>
	  		<v-row>
	  			<v-col cols="1">
	  				<OttraStepState :step-state="localStep.saveState"></OttraStepState>
	  				<v-icon>mdi-format-list-checkbox</v-icon>
	  			</v-col>
	  			<v-col cols="5">
				    {{ localStep.title || '<(*) New step>' }}
	  			</v-col>
	  			<v-col cols="3">
				    {{ getRoomName }}
	  			</v-col>
	  			<v-col cols="1">
	  				{{ localStep.duration }}
	  			</v-col>
	  			<v-col cols="2">
	  				<div :class="getThumbColor">
	  					{{ tickLabels[localStep.energyExpense] }}
	  				</div>
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
		          append-icon="mdi-iframe-variable-outline" 
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
		          append-icon="mdi-iframe-variable-outline" 
		          outlined
		          hint="(*) Describe the step here"
		          label="(*) Description">
		        </v-textarea>
	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.description }} 
	  			</v-col>
	  		</v-row>

        <v-row>
          <v-col>
          	<OttraOptionalStep v-model="localStep.optionalStep"></OttraOptionalStep>
          </v-col>
        </v-row>


	  		<v-row> <!-- What room -->
	  			<v-col v-if="editMode">
				    <v-autocomplete
		          v-model="localStep.stepLocation"
				    	prepend-icon="mdi-floor-plan"
				      label="(*) Which room"
				      :items="roomList"
				      item-text="name"
				      item-value="uuid"
				    ></v-autocomplete>
	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.stepLocation }} 
	  			</v-col>
	  		</v-row>

	  		<v-row>	<!-- Duration -->
	  			<v-col v-if="editMode">
	  				<OttraDateTimePicker 
	  					time-only
	  					timeLabel="(*) Duration"
	  					timeHint="(*) Duration"
		          append-icon="mdi-iframe-variable-outline" 
	  					:time="localStep.duration"
	  					v-on:set-time="localStep.duration = $event">
	  				</OttraDateTimePicker>
	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.duration }} 
	  			</v-col>
	  		</v-row>

	  		<v-row> <!-- Energy Expense. TODO: Should be a separate component -->
	  			<v-col v-if="editMode">
			      <v-slider
		          v-model="localStep.energyExpense"
		          prepend-icon="mdi-flash"
		          append-icon="mdi-iframe-variable-outline" 
			        :tick-labels="tickLabels"
			        :max="4"
			        step="1"
			        :thumb-color="getThumbColor"
			        :track-fill-color="getThumbColor"
      			  ticks="always"
        			tick-size="4"></v-slider>
	  			</v-col>
	  			<v-col v-else>
				    {{ tickLabels[localStep.energyExpense] }} 
	  			</v-col>
	  		</v-row>

	  		<v-row>
	  			<v-col v-if="editMode">
				    <v-autocomplete
		          v-model="localStep.equipment"
				    	prepend-icon="mdi-hammer"
				      label="(*) Necessary tools"
				      :items="toolList"
				      item-text="name"
				      item-value="uuid"
				    ></v-autocomplete>
	  			</v-col>
	  			<v-col v-else>
				    {{ localStep.equipment }} 
	  			</v-col>
				</v-row>

	  		<v-row v-if="editMode"> 

          <v-col cols="5">
            <v-text-field 
              v-model="localStep.visualAidImages" 
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
              v-model="localStep.visualAidImages">
            </OttraDocumentBrowser>
          </v-col>

          <v-col cols="5">
            <v-text-field 
              v-model="localStep.attachments" 
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
              v-model="localStep.attachments">
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
	  </v-expansion-panel-content>

	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import OttraDateTimePicker from '@/components/OttraDateTimePicker'
import OttraStepState from '@/components/OttraStepState'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'
import OttraOptionalStep from '@/components/steps/subcomponents/OttraOptionalStep'

export default {
	name: 'ottra-instruction-step',
	props: [ 'thisStep', 'editMode', 'stepOrder'  ],
	components: {
		OttraDateTimePicker,
		OttraStepState,
		OttraOptionalStep,
    OttraDocumentBrowser 
	},
	data: function() {
		return {
			tickLabels: [
				"(*) Återhämtning",
				"(*) Nollsumma",
				"(*) Ansträngande",
				"(*) Tröttande",
				"(*) Utmattande"
			],
			localStep: {
				tools: {},
				stepLocation: '',
				visualAidImages: [],
				attachments: [],
				optionalStep: false,
			}
		}
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
		getThumbColor: function() {
			const colors = [
				"blue",
				"green",
				"yellow",
				"orange",
				"red"
			]
			console.debug("%s: Step value is: %s", __filename, this.localStep.energyExpense)
			return colors[this.localStep.energyExpense]
		},
		getRoomName: function() {
			if (this.localStep.hasOwnProperty('stepLocation')) {
				const loc = this.localStep.stepLocation

				if (loc != '') {
					const rooms = this.getRooms
					if (Object.values(rooms).length) {
						return rooms[loc].name || ''
					}
				}
			}
			return ''
		}
	},
	methods: {
		saveStep: function() {
			console.debug("%s: saveStep, payload is: %O", __filename, this.localStep)
			this.$store.dispatch("saveStep", this.localStep)
		}
	},
	created() {
		this.localStep = Object.assign(this.localStep, this.thisStep)
	}
}

</script>	