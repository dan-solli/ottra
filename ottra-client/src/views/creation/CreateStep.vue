<template>
  <v-card>
    <v-card-title>
      (*) Create new step 
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text icon @click="startTour">
            <v-icon>help_outline</v-icon>
          </v-btn>
        </template>
        {{ $t('ui.tooltip.starttour') }}
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text icon @click="closeDialog">
            <v-icon>clear</v-icon>
          </v-btn>
        </template>
        {{ $t('ui.text.close') }}                  
      </v-tooltip>

    </v-card-title>

    <v-card-text>

    	<component 
    		:is="getComponent(step.stepType)"
        v-model="step"
        edit-mode
        :task_uuid="task_uuid"
        @dirty="val => { isDirty = val }">
    	</component>

    </v-card-text>
    <v-tour name="CreateStepTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex'

import { StepFactory } from '@/common/repos/StepFactory'

export default {
	name: 'create-step',
	props: [ 'step_uuid', 'task_uuid' ],
  data: function() {
    return {
      isDirty: false
    }
  },
  computed: {
  	...mapGetters([
  		"getStepById",
  	]),
    tourLabels: function() {
      return {
        labels: {
          buttonSkip: this.$t('ui.tour.buttonSkip'),
          buttonPrevious: this.$t('ui.tour.buttonPrevious'),
          buttonNext: this.$t('ui.tour.buttonNext'),
          buttonStop: this.$t('ui.tour.buttonStop')
        }
      }
    },
    tourSteps: function() { 
      return [
        { 
          target: '.tour-step-1',
          content: this.$t('ui.tour.loginuser.step1'),
          params: {
            placement: 'left'
          }
        },
        { 
          target: '.tour-step-2',
          content: this.$t('ui.tour.loginuser.step2'),
          params: {
            placement: 'left'
          }
        },
        { 
          target: '.tour-step-4',
          content: this.$t('ui.tour.loginuser.step4'),
          params: {
            placement: 'right'
          }
        },
      ]
    },
    step: function() {
    	return this.getStepById(this.step_uuid)
    }
  },
  methods: {
    getComponent(type) {
      return StepFactory.getStepContentComponent(type)
    },
    startTour: function() {
      this.$tours['CreateTaskTour'].start()
    },
    closeDialog: function() {
      this.$router.go(-1) // push('/task')
    },
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.isDirty) {
      const answer = window.confirm("(*) Do you really want to leave? You have unsaved changes!")
      if (answer) {
        next() 
      } else {
        next(false)
      }
    } else {
      next()
    }
  },  
}

</script>