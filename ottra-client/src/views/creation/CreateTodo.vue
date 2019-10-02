<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.edittodo.heading') }} 
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

      <v-container fluid fill-height>
        <v-row align-center justify-center>
          <v-col cols="12">

            <v-form ref="form">

              <v-stepper v-model="currentStep" vertical>
                <v-stepper-step step="1" :complete="currentStep > 1" editable>
                  {{ $t('ui.view.edittodo.step1.header') }}
                </v-stepper-step>
                <v-stepper-content step="1">
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-text-field 
                          v-model="payload.subject" 
                          :label="$t('ui.domobj.todo.subject')" 
                          type="text"
                          prepend-icon="mdi-page-layout-header" 
                          required>
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-textarea
                          v-model="payload.body"
                          prepend-icon="mdi-comment"
                          outlined
                          :hint="$t('ui.view.edittodo.step1.description.hint')"
                          :label="$t('ui.view.edittodo.step1.description')">
                        </v-textarea>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <v-btn color="primary" @click="nextStep">
                          {{ $t('ui.text.continue') }} </v-btn>
                        <v-btn text @click="closeDialog">
                          {{ $t('ui.text.cancel') }}
                        </v-btn>
                      </v-col>
                    </v-row>

                  </v-container>
                </v-stepper-content>

                <v-stepper-step step="2" :complete="currentStep > 2" editable>
                  {{ $t('ui.view.edittodo.step2.header') }}
                </v-stepper-step>
                <v-stepper-content step="2">
                  <v-container>
                    <v-row>
                      <v-col>
                        <span class="headline"> (*) When you want it done.</span>
                        <OttraDateTimePicker
                          :time="payload.softDLTime" 
                          :date="payload.softDLDate"
                          v-on:set-date="payload.softDLDate = $event"
                          v-on:set-time="payload.softDLTime = $event">
                        </OttraDateTimePicker>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <span class="headline"> (*) When it HAS to be done.</span>
                        <OttraDateTimePicker 
                          :time="payload.hardDLTime" 
                          :date="payload.hardDLDate"
                          v-on:set-date="payload.hardDLDate = $event"
                          v-on:set-time="payload.hardDLTime = $event">
                        </OttraDateTimePicker>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <v-btn color="primary" @click="nextStep">
                          {{ $t('ui.text.continue') }} </v-btn>
                        <v-btn text @click="closeDialog">
                          {{ $t('ui.text.cancel') }}
                        </v-btn>
                      </v-col>
                    </v-row>

                  </v-container>
                </v-stepper-content>

                <v-stepper-step step="3" :complete="currentStep > 3" editable>
                  {{ $t('ui.view.edittodo.step3.header') }}
                </v-stepper-step>
                <v-stepper-content step="3">
                  <v-container>
                    <v-row>
                      <v-col>
                        <span class="headline"> (*) Set priority.</span>
                        <component :is="getStrategyComponent" 
                          v-on:set-priority="payload.priority = $event">
                        </component>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <v-btn color="primary" @click="saveTodo">
                          {{ $t('ui.text.saveandcontinue') }} </v-btn>
                        <v-btn text @click="closeDialog">
                          {{ $t('ui.text.cancel') }}
                        </v-btn>
                      </v-col>
                    </v-row>

                  </v-container>
                </v-stepper-content>

                <v-stepper-step step="4" :complete="currentStep > 4" editable>
                  {{ $t('ui.view.edittodo.step4.header') }}
                </v-stepper-step>
                <v-stepper-content step="4">
                  <v-container>
                    <v-row>
                      <v-col>
                        <span class="headline"> (*) Set steps.</span>

                        <v-list dense>
                          <v-list-item-group>
                            <v-list-item v-for="(item, i) in hydratedSteps" :key="i">
                              <v-list-item-icon>
                                <v-btn icon @click="deleteStep(i, item)">
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title v-text="item.description"></v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <v-text-field 
                          v-model="newStep" 
                          :label="$t('ui.domobj.todo.subject')" 
                          type="text"
                          prepend-icon="mdi-note-plus" 
                          required>
                        </v-text-field>
                        <v-btn color="primary" :disabled="!newStep"
                          @click="addStep"
                          v-shortkey.push="['enter']"
                          @shortkey="addStep">
                            (*) Add step
                        </v-btn>
                      </v-col>
                    </v-row>


                    <v-row>
                      <v-col>
                        <v-btn color="primary" @click="saveTodo">
                          {{ $t('ui.text.save') }} </v-btn>
                        <v-btn text @click="closeDialog">
                          {{ $t('ui.text.cancel') }}
                        </v-btn>
                      </v-col>
                    </v-row>

                  </v-container>
                </v-stepper-content>


              </v-stepper>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-tour name="CreateTodoTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { TODO_NEW } from '@/common/todo.types'
import OttraDateTimePicker from '@/components/OttraDateTimePicker'

import OttraPriorityStrategyDefault from '@/components/strategies/Default'

export default {
  name: "create-todo",
  props: [ 'todo_uuid' ],
  components: {
    OttraDateTimePicker,
    OttraPriorityStrategyDefault
  },
  data: function() {
    return {
      currentStep: 1,
      newStep: '',
      payload: {
        uuid: '',
        body: '',
        created: '',
        creator: '',
        softDLDate: null,
        hardDLDate: null,
        softDLTime: null,
        hardDLTime: null,
        priority: 0,
        relType: '',
        status: TODO_NEW,
        steps: [],
      },
    }
  },
  mounted: function() {
    if (this.todo_uuid) {
      console.debug("%s: mounted() got todo_uuid %s", __filename, this.todo_uuid)
      this.payload = Object.assign(this.payload, this.getTodoById(this.todo_uuid))
    }
  },
  computed: {
    ...mapGetters([
      "getTodoById",
      "getStepById",
    ]),
    hydratedSteps: function() {
      return this.payload.steps.map(function(step_uuid) {
        //console.debug("%s: hydratedSteps: Hydrating step %s", __filename, step_uuid)
        const stepData = this.getStepById(step_uuid)
        //console.debug("%s: hydratedSteps: stepData is %O", __filename, stepData)
        return stepData
      }, this)
    },
    getStrategyComponent: function() {
      return OttraPriorityStrategyDefault
    },
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
    }
  },
  methods: {
    addStep: async function() {
      if (this.newStep.length > 0) {
        const response = await this.$store.dispatch("saveStep", { 
          parent_uuid: this.payload.uuid, 
          description: this.newStep 
        })
        this.payload.steps.push(response.uuid)
        this.newStep = ''
      }
    },
    deleteStep: function(index, item) {
      this.payload.steps.splice(index, 1)
      this.$store.dispatch("deleteStep", item.uuid)
    },
    saveTodo: function() {
      this.payload.uuid = this.todo_uuid
      this.$store.dispatch("updateTodo", this.payload)
      .then(() => {
        this.nextStep()
      })
      .catch((err) => {
        console.error("%s: updateTodo failed: %s", __filename, error)
      })
    },
    startTour: function() {
      this.$tours['CreateTodoTour'].start()
    },
    closeDialog: function() {
      this.$router.push('/todo')
    },
    nextStep: function() {
      console.debug("%s: nextStep: currentStep is %d", __filename, this.currentStep)
      this.currentStep = this.currentStep + 1
    },
  }
};
</script>

