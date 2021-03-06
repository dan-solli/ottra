<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.edittask.heading') }} 

      <v-spacer></v-spacer>

      <v-menu offset-y >
        <template v-slot:activator="{ on }">
          <v-btn class="mr-3" text v-on="on">
            {{ $t('ui.view.addstepstotask') }}
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
                  <v-col cols="2">
                    (*) Duration
                  </v-col>
                  <v-col cols="4">
                    {{ getTaskDuration(task.uuid) | toHMS }}
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
        { type: STEP_INSTRUCTION, 
          description: this.$t('ui.component.step.steptype.instruction') },
        { type: STEP_PAUSE, 
          description: this.$t('ui.component.step.steptype.pause') },
        { type: STEP_TRANSPORT, 
          description: this.$t('ui.component.step.steptype.transport') },
        { type: STEP_TASK, 
          description: this.$t('ui.component.step.steptype.task') },
      ]
    }
  },
  filters: {
    toHMS: function (value) {
      if (!value) {
        return ''
      } else {
        const hr = parseInt(value / 60)
        const min = value % 60
        return hr + ":" + min
      }
    }
  },
  computed: {
    ...mapGetters([
      "getStepById",
      "getTaskById",
      "getTaskDuration",
    ]),
    QRCodeImage: function() {
      return 'https://' + window.location.host + window.location.pathname
    },
    task: function() {
      console.debug("%s: computed.task called", __filename)
      return this.getTaskById(this.task_uuid)
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
  created() {
    this.loadData()
  },
  async beforeRouteUpdate(to, from, next) {
    console.debug("%s: beforeRouteUpdate has been called.", __filename)
    this.task_uuid = to.params.task_uuid
    await this.loadData()
    next()
  },
  methods: {
    loadData: async function() {
      this.loading = true
      await this.$store.dispatch("fetchTask", { 
        task_uuid: this.task_uuid,
        force_hydrate: true  
      })
      this.loading = false
    },
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

