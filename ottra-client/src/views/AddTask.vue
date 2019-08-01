<template>
	<div class="new_task">
		<h1>New Task</h1>

	  <v-stepper v-model="currentStep" vertical non-linear>
	    <v-stepper-step :complete="currentStep > 1" editable step="1">
	      Name and description
	      <small v-if="currentStep == 1">
	      	Tasks come in many forms. From a simple one-time task to tasks with many 
	      	separate steps, possibly spanning over several days.<br />
	      	At later steps, you can short circuit the creation process by choosing the 
	      	button 'Save and Close' instead of 'Next'.<br />
	      	You are not required to walk through all steps to create a new task.
	      </small>
	    </v-stepper-step>

	    <v-stepper-content step="1">
	      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
	      <v-btn color="primary" @click="saveAndClose">Save and close </v-btn>
	      <v-btn color="primary" @click="currentStep = 2">Continue</v-btn>
	      <v-btn flat>Cancel</v-btn>
	    </v-stepper-content>

	    <v-stepper-step :complete="currentStep > 2" editable step="2">
	    	Priority
	      <small v-if="currentStep == 2">
	      	Your choice of strategy determines how you prioritize the task. You can check your strategy settings <router-link to="/settings">here</router-link>.
	      	<br />
	      </small>
	    </v-stepper-step>

	    <v-stepper-content step="2">
	      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
	      <v-btn color="primary" @click="saveAndClose">Save and close </v-btn>
	      <v-btn color="primary" @click="currentStep = 3">Continue</v-btn>
	      <v-btn flat>Cancel</v-btn>
	    </v-stepper-content>

	    <v-stepper-step :complete="currentStep > 3" editable step="3">
	    	Recurrance
	      <small v-if="currentStep==3">
	      	Here, you choose if this is a one time only task, if it should be repeated and if so,
	      	at what interval. <br />
	      	You are also given the option to choose how the system should handle a task you have 
	      	planned, but not done. Should it be rescheduled somehow, or forgotten.
	      </small>
	    </v-stepper-step>

	    <v-stepper-content step="3">
	      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
	      <v-btn color="primary" @click="saveAndClose">Save and close </v-btn>
	      <v-btn color="primary" @click="currentStep = 4">Continue</v-btn>
	      <v-btn flat>Cancel</v-btn>
	    </v-stepper-content>

	    <v-stepper-step editable step="4">
	    	Categorization
	      <small v-if="currentStep==4">
	      	Here, you can set categories, which will give you the option to sort and filter tasks.
	      	Categories are used to compile statistics, thus how tasks are categorized might give you
	      	better insights when such statistics are being analyzed.
	 				<br />
	 				You can also set tags for searching.  
	 				<br />
	 				Both categories and tags can be color coded, potentially increasing visual aspects.
	      </small>
	    </v-stepper-step>

	    <v-stepper-content step="4">
	      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
	      <v-btn color="primary" @click="saveAndClose">Save and close </v-btn>
	      <v-btn color="primary" @click="currentStep = 5">Continue</v-btn>
	      <v-btn flat>Cancel</v-btn>
	    </v-stepper-content>

	    <v-stepper-step step="5" editable>
	    	Variables, equipment and locations
	      <small v-if="currentStep==5">
	      	<p> 
		      	Variables concern itself with potential underlying steps, if a task is broken down
		      	into such. A step can describe a package of variables, yet the task itself is the same.
		      	Ie. Task: Wash clothes. The task is inherently the same every time, yet the washing 
		      	machine may need different settings for a single run. You can control how and when
		      	these settings will be determined.
		      </p>
		      <p>
		      	Some tasks and underlying steps may need certain equipment to be completed. Here you 
		      	can determine how these equipment will be handled during the execution of the task.
		      </p>
		      <p> 
		      	You can also control how tasks concerning different locations and potentially 
		      	weather/clothes should be handled.
		      </p>
	      </small>
	    </v-stepper-step>

	    <v-stepper-content step="5">
	      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
	      <v-btn color="primary" @click="saveAndClose">Save</v-btn>
	      <v-btn flat>Cancel</v-btn>
	    </v-stepper-content>


  	</v-stepper>

	</div>
</template>

<script>

export default {
	name: 'newTask',
	data: () => ({
		currentStep: 1
	}),
	methods: {
		saveAndClose: function() {
			// Do nothing right now.
		}
	}
}
</script>
