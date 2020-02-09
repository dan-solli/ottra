<template>
  <v-card>
    <v-card-title>
      (*) Create new task 
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
            <v-form ref="form" v-model="valid">
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
                  <v-col cols="12">
                    <v-textarea
                      v-model="payload.body"
                      prepend-icon="mdi-comment"
                      outlined
                      :hint="$t('ui.view.edittask.description.hint')"
                      :label="$t('ui.view.edittask.description')">
                    </v-textarea>
                  </v-col>
                </v-row>

                <!-- Implemented as a row. Bad. -->
                <OttraRecurringTask
                  v-on:set-recurrance-how-often="payload.recurranceEvery = $event"
                  v-on:set-recurrance-what="payload.recurranceType = $event">
                </OttraRecurringTask>

                <v-row>
                  <v-col cols="12">
                    <v-icon class="mr-2">mdi-priority-high</v-icon>
                    <v-btn-toggle 
                      mandatory 
                      v-model="payload.task_priority">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">5</v-btn> 
                        </template>
                        <span> (*) No priority. It would be nice if the task could be completed. No big deal if it is not </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">4</v-btn> 
                        </template>
                        <span> (*) Low priority. The task should be completed or it will be inconvenient or filthy. </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">3</v-btn> 
                        </template>
                        <span> (*) Mid priority. The task should be completed or it will be bad. </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">2</v-btn> 
                        </template>
                        <span> (*) High priority. The task has to be completed or the consequences will be dire. </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">1</v-btn> 
                        </template>
                        <span> (*) Highest priority. The task has to be completed or the consequences will be extremely dire. </span>
                      </v-tooltip>

                    </v-btn-toggle>
                  </v-col>
                </v-row>

                <v-row> <!-- Visual Aid Images -->
                  <v-col cols="5">
                    <v-text-field 
                      v-model="payload.goodEnoughImages" 
                      label="(*) Good enough images" 
                      type="text"
                      disabled
                      prepend-icon="mdi-bullseye" 
                      required>
                    </v-text-field>
                  </v-col>
                  <v-col cols="1">
              
                    <OttraDocumentBrowser 
                      v-model="payload.goodEnoughImages">
                    </OttraDocumentBrowser>
                  </v-col>

                  <v-col cols="5">
                    <v-text-field 
                      v-model="payload.goalImages" 
                      label="(*) Goal Images" 
                      type="text"
                      disabled
                      prepend-icon="mdi-bullseye-arrow" 
                      required>
                    </v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <OttraDocumentBrowser
                      v-model="payload.goalImages">
                    </OttraDocumentBrowser>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-btn color="primary" @click="saveTask"> {{ $t('ui.text.save') }} </v-btn>
                    <v-btn text @click="closeDialog">{{ $t('ui.text.cancel') }} </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-tour name="CreateTaskTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import OttraRecurringTask from '@/components/OttraRecurringTask'
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'

export default {
  name: "create-task",
  components: {
    OttraRecurringTask,
    OttraDocumentBrowser 
  },
  props: [ 'task_uuid' ],
  data: function() {
    return {
      valid: '',
      payload: {
        subject: '',
        uuid: '',
        body: '',
        created: '',
        creator: '',
        steps: [],
        recurranceEvery: 1,
        recurranceType: 1,
        goodEnoughImages: [],
        goalImages: []
      },
    }
  },
  computed: {
    ...mapGetters([
      "getSelectedFiles"
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
    }
  },
  methods: {
    startTour: function() {
      this.$tours['CreateTaskTour'].start()
    },
    closeDialog: function() {
      this.$router.push('/task')
    },
    saveTask: async function() {
      console.debug("%s: saveTask, payload is: %O", __filename, this.payload)
      const result = await this.$store.dispatch("saveTask", this.payload)
      console.debug("%s: saveTask success: %O", __filename, result)
      this.$router.push('/task/' + result.uuid)
    },
    attachGoalDocuments: function() {
      this.payload.goodEnoughImages = [...this.getSelectedFiles]
      this.$store.dispatch("clearSelectedFiles")
    },
    attachVisualAid: function() {
      this.payload.goalImages = [...this.getSelectedFiles]
      this.$store.dispatch("clearSelectedFiles")
    }
  }
}
</script>

