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
          <v-list-item @click="addStep(STEP_INSTRUCTION)">
            <v-list-item-title> 
              (*) Instruction 
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="addStep(STEP_PAUSE)">
            <v-list-item-title> 
              (*) Pause 
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="addStep(STEP_TRANSPORT)">
            <v-list-item-title> 
              (*) Transport
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="addStep(STEP_TASK)">
            <v-list-item-title> 
              (*) Task
            </v-list-item-title>
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
                    <v-btn color="primary" @click="saveTask"> {{ $t('ui.text.save') }} </v-btn>
                    <v-btn text @click="closeDialog">{{ $t('ui.text.cancel') }} </v-btn>
                  </v-col>
                </v-row>
-->                
                <v-row>
                  <v-col cols="12">
                    <v-expansion-panels v-model="panelExpansions">
                      <v-expansion-panel v-for="(step, i) in steps" :key="i">
                        <v-expansion-panel-header>
                          <component :is="step.componentHeader" v-model="steps[i].data">
                          </component>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <component :is="step.componentContent" v-model="steps[i].data">
                          </component>
<!--
                          <component 
                            :is="step.component"
                            v-model="step.data"
                            :step-order="step.order"
                            :edit-mode="step.editMode">
                          </component>
-->                          
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
  stepTypeMixin
} from '@/common/mixins/step.types.mixin'

import QrcodeVue from 'qrcode.vue'

export default {
  name: "add-steps-to-task",
  props: [ 'task_uuid' ],
  mixins: [ stepTypeMixin ],
  components: {
    QrcodeVue
  },
  data: function() {
    return {
      current_step: 0,
      panelExpansions: [],
      valid: '',
      task: { },
      steps: [],
    }
  },
  computed: {
    ...mapGetters([
      "getStepById",
      "getTaskById",
      "getRooms",
    ]),
    QRCodeImage: function() {
      return 'https://' + window.location.host + window.location.pathname
    }
  },
  async mounted() {
    await this.$store.dispatch("loadTasks")
    await this.$store.dispatch("loadSteps")
    if (this.task_uuid) {
      this.task = Object.assign({}, this.getTaskById(this.task_uuid))
    } 
/*    
    else {
      this.$router.push("/task")
    }
*/    
  },
  methods: {
    startTour: function() {
    },
    closeDialog: function() {
      this.$router.push('/task')
    },
    saveTask: function() {
      const payload = {
        task,
        steps
      }
      console.debug("%s: saveTask, payload is: %O", __filename, this.payload)
      this.$store.dispatch("saveTask", this.payload)
      this.$router.push('/task')
    },
    addStep: function(step_type) {
      this.steps.push(this.stepFactory(step_type, this.current_step++))
    }
  }
}
</script>

