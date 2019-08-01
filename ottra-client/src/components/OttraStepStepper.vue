<template>
	<div class="ottra_step_stepper">
		<v-layout>
			<v-flex xs12 sm6 offset-sm3>
				<v-card>
					<v-stepper v-model="currentStep" vertical non-linear>
						<template v-for="(step, index) in stepList">
							<v-stepper-step :key="index" editable :step="index+1">
								<v-toolbar dense flat color="white">
									<v-toolbar-items>
										<v-btn icon flat v-if="index >= 1"
											@click.capture.stop="moveStepUp(index)">
											<v-icon>arrow_upward</v-icon>
										</v-btn>
										<v-btn icon flat v-if="index+1 < stepCount"
											@click.capture.stop="moveStepDown(index)">
											<v-icon>arrow_downward</v-icon>
										</v-btn>
									</v-toolbar-items>
									<v-toolbar-title> {{ step.title }} </v-toolbar-title>
								</v-toolbar>
							</v-stepper-step>


							<v-stepper-items>
								<v-stepper-content :step="index+1">
									<v-text-field prepend-icon="title"
										v-model="step.title" label="Title" required>
									</v-text-field>
									<v-text-field prepend-icon="description"
										v-model="step.instruction" label="Instruction" required>
									</v-text-field>
									<v-select :items="roomList" item-text="Name" item-value="uuid"
										label="Where?" prepend-icon="home" v-model="step.room">
									</v-select>
									      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="step.duration"
        persistent
        lazy
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="step.duration"
            label="Duration"
            prepend-icon="access_time"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="modal"
          v-model="step.duration"
          full-width
        >
                  <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
        </v-time-picker>
      </v-dialog>
							
									<v-btn 
										color="primary" 
										v-if="currentStep != stepCount"
										@click="nextStep(currentStep)">Continue</v-btn>
									<v-btn 
										color="green" 
										v-if="currentStep == stepCount"
										@click="addStep">Add Step</v-btn>
									<v-btn flat>Cancel</v-btn>
									<v-btn icon flat> <v-icon>delete</v-icon> </v-btn>
								</v-stepper-content>
							</v-stepper-items>

							<v-divider v-if="currentStep !== stepCount"></v-divider>

						</template>
					</v-stepper>
				</v-card>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'ottra-step-stepper',
	data: () => ({
		modal: false,
		currentStep: 1,
		stepList: [
			{ title: "This is the first step", instruction: "One" },
			{ title: "This is the second step", instruction: "Two"  },
			{ title: "This is the third step", instruction: "Three"  }
		]
	}),
	computed: {
		...mapGetters([
			'rooms',
			'storages',
			'equipment'
		]),
		stepCount: function() {
			return this.stepList.length
		},
		roomList: function() {
			return Object.values(this.rooms)
		}
	},
	methods: {
		nextStep: function() {
			if (++this.currentStep > this.stepCount)
				this.currentStep--
		},
		addStep: function() {
			this.stepList.push( { title: "New Step", description: "A new step" })
		},
		moveStepUp: function(index) {
			this.stepList.splice(index-1, 0, this.stepList.splice(index, 1)[0])
		},
		moveStepDown: function(index) {
			this.stepList.splice(index+1, 0, this.stepList.splice(index, 1)[0])
		}
	}
}	
</script>
