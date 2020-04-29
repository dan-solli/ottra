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

          <v-list-item v-for="(step_item, i) in stepTypes" :key="i" @click="addStep(step_item.type)">
            <v-list-item-title>{{ step_item.description }}</v-list-item-title>
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
                <v-row v-if="!loading">
                  <v-col cols="12">
                    <v-expansion-panels v-model="panelExpansions">
                      <v-expansion-panel v-for="(step, i) in steps" :key="i">
                        <v-expansion-panel-header>
                          <component 
                            :is="getHeaderComponent(step.stepType)"
                            :task_uuid="task_uuid"
                            :step_position="i"
                            v-model="steps[i]">
                          </component>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <component 
                            :is="getContentComponent(step.stepType)" 
                            :task_uuid="task_uuid"
                            :step_position="i"
                            v-model="steps[i]">
                          </component>
                     
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="12">
                    Loading 
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
      loading: false,
      hasEdits: false,
      panelExpansions: [],
      valid: '',
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
    task: function() {
      console.debug("%s: computed.task called", __filename)
      return this.getTaskById(this.task_uuid)
/*
      if (!this.task_uuid || this.loading) {
        return {}
      } else {
        return this.getTaskById(this.task_uuid)
      }
*/
    },
    steps: function() {
      console.debug("%s: computed.steps called", __filename)
      if (!this.task_uuid || this.loading) {
        return []
      } else {
        return this.task.steps.map(function(step_uuid) {
          return this.getStepById(step_uuid)
        }, this)
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    console.debug("%s: beforeRouteEnter has been called.", __filename)
    console.debug("%s: beforeRouteEnter to = %O", __filename, to)
    console.debug("%s: beforeRouteEnter from = %O", __filename, from)
    next(async function(vm) {
      console.debug("%s: In callback, task_uuid might be: %s", __filename, to.params.task_uuid)
      vm.task_uuid = to.params.task_uuid
      vm.loading = true
      console.debug("%s: In callback, trying to save task_uuid: %s", __filename, vm.task_uuid)
      await vm.$store.dispatch("fetchTask", { task_uuid: vm.task_uuid })
      vm.loading = false
    })
  },
  async beforeRouteUpdate(to, from, next) {
    console.debug("%s: beforeRouteUpdate has been called.", __filename)
    this.task_uuid = to.params.task_uuid
    this.loading = true
    await this.$store.dispatch("fetchTask", { task_uuid: this.task_uuid })
    this.loading = false
    next()
  },
/*  
  async mounted() {
    if (this.task_uuid) {
      this.loading = true
      await this.$store.dispatch("fetchTask", this.task_uuid)
      //this.task = Object.assign({}, this.getTaskById(this.task_uuid))
      this.loading = false
    } 
  },
  beforeRouteUpdate(to, from, next) {
    console.debug("ROUTE: %s: beforeRouteUpdate called", __filename)
    this.task_uuid = to.params.task_uuid
    next()
  },
*/  
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

