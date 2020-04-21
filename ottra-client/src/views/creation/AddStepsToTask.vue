<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.edittask.heading') }} 

      <v-spacer></v-spacer>

      <v-menu offset-y >
        <template v-slot:activator="{ on }">
          <v-btn class="mr-3" text v-on="on">
            (*) Add step
          </v-btn>
        </template>
        <v-list dense>

          <v-list-item v-for="(step, i) in stepTypes" :key="i" @click="addStep(step.type)">
            <v-list-item-title>{{ step.description }}</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-menu>

      <v-divider vertical class="mr-2"></v-divider>

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
      <v-container fluid fill-height>
        <v-row align-center justify-center>
          <v-col cols="12">
            <v-form ref="form" v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="2">
                    {{ $t('ui.domobj.todo.subject') }}
                  </v-col>
                  <v-col cols="10">
                    {{ task.subject }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    {{ $t('ui.view.edittask.description') }}
                  </v-col>
                  <v-col cols="10">
                    {{ task.body }}
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <qrcode-vue :value="QRCodeImage"></qrcode-vue>
                  </v-col>
                </v-row>

<!--
                <v-row>
                  <v-col cols="12">
                    WHY DO I EXIST?! FOR WHAT? WHEN? WHY?
                    <v-spacer></v-spacer>
                    <v-btn @click="saveTask">Save</v-btn>
                  </v-col>
                </v-row>
-->
                <v-row>
                  <v-col cols="12">
                    <v-expansion-panels v-model="panelExpansions">
                      <v-expansion-panel v-for="(step, i) in steps" :key="i">
                        <v-expansion-panel-header>
                          <component 
                            :is="getHeaderComponent(step.stepType)"
                            v-model="steps[i]">
                          </component>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <component 
                            :is="getContentComponent(step.stepType)" 
                            v-model="steps[i]">
                          </component>
                     
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

<!--
    <v-tour name="CreateTaskTour" :steps="tourSteps" :options="tourLabels"></v-tour>
-->    
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex'

import { 
  STEP_INSTRUCTION,
  STEP_TASK,
  STEP_TRANSPORT,
  STEP_PAUSE,
  StepFactory,
} from '@/common/repos/StepFactory'

import QrcodeVue from 'qrcode.vue'

export default {
  name: "add-steps-to-task",
  props: [ 'task_uuid' ],
  components: {
    QrcodeVue,
  },
  data: function() {
    return {
      hasEdits: false,
      panelExpansions: [],
      valid: '',
      task: { },
      stepTypes: [
        { type: STEP_INSTRUCTION, description: "(*) Instruction" },
        { type: STEP_PAUSE, description: "(*) Pause" },
        { type: STEP_TRANSPORT, description: "(*) Transport" },
        { type: STEP_TASK, description: "(*) Task" },
      ]
    }
  },
  computed: {
    ...mapGetters([
      "getStepById",
      "getTaskById",
    ]),
    QRCodeImage: function() {
      return 'https://' + window.location.host + window.location.pathname
    },
    steps: function() {
      if (!this.task_uuid || !this.task.hasOwnProperty('uuid')) {
        // TODO: Some loading symbol here, maybe...
        return []
      } else {
        return this.task.steps.map(function(f) {
          const step = this.getStepById(f)
          console.debug("%s: In map for f=%s gets %O", __filename, f, step)
          return step
        }, this)
      }
    },
  },
  async mounted() {
    if (this.task_uuid) {
      this.task = Object.assign({}, this.getTaskById(this.task_uuid))

      // This should not be necessary. When we load a task from backend, we sure as hell need
      // to receive all steps completely hydrated. Loading and splitting the steps, substituting the
      // uuid only is the responsibility of Vuex. And the problem of returning proper data is the 
      // responsibility of backend. Not some extra dispatch here!

      //this.$store.dispatch("loadTaskSteps", this.task_uuid)
    } 
/*    
    else {
      this.$router.push("/task")
    }
*/    
  },
  methods: {
    getHeaderComponent(type) {
      return StepFactory.getStepHeaderComponent(type)
    },
    getContentComponent(type) {
      return StepFactory.getStepContentComponent(type)
    },

    startTour: function() {
    },
    closeDialog: function() {
      this.$router.push('/task')
    },
/*    

    This method should never be used. If you press edit on the task, we should return to CreateTask-view
    with proper flagging, thus giving back the editable fields.

    saveTask: function() {
      console.debug("%s: saveTask, payload is: %O", __filename, this.task)
      this.$store.dispatch("updateTask", this.task)
      //this.$router.push('/task')
    },
*/    
    addStep: async function(step_type) {
      if (!this.task_uuid) {
        console.error("%s: addStep called without task_uuid", __filename)
        // Fucking impossible!
      } else {
        const step_uuid = await this.$store.dispatch("createNewStep", {
          step_type: step_type, 
          task_uuid: this.task_uuid
        })
        this.$router.push({ 
          name: 'new_step', params: { 
            task_uuid: this.task_uuid,
            step_uuid: step_uuid
          }
        })
      }
    },
  }
}
</script>

