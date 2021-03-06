<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.createtask.title') }} 
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

                <v-row>
                  <v-col cols="auto">
                    <v-text-field 
                      class="pr-2"
                      prepend-icon="mdi-calendar-repeat"
                      persistent-hint
                      :hint="$t('ui.view.createtask.recurrancerepeathint')"
                      v-model="payload.recurranceNumber"
                      min="1"
                      max="10000"
                      type="number">
                    </v-text-field>
                  </v-col>
                  <v-col cols="auto">
                    <v-select 
                      class="pl-2"
                      v-model="payload.recurranceType"
                      :items="recurranceOptions"
                      item-text="title"
                      item-value="option">
                    </v-select>
                  </v-col>
                </v-row>
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
                        <span> 
                          {{ $t('ui.view.createtask.priority.tooltip.nopriority') }}
                        </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">4</v-btn> 
                        </template>
                        <span>
                          {{ $t('ui.view.createtask.priority.tooltip.lowpriority') }}
                        </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">3</v-btn> 
                        </template>
                        <span>
                          {{ $t('ui.view.createtask.priority.tooltip.midpriority') }}
                        </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">2</v-btn> 
                        </template>
                        <span>
                          {{ $t('ui.view.createtask.priority.tooltip.highpriority') }}
                        </span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn @click.native.stop v-on="on">1</v-btn> 
                        </template>
                        <span>
                          {{ $t('ui.view.createtask.priority.tooltip.highestpriority') }}
                        </span>
                      </v-tooltip>

                    </v-btn-toggle>
                  </v-col>
                </v-row>

                <v-row> <!-- Visual Aid Images -->
                  <v-col cols="5">
                    <v-text-field 
                      :value="attachmentUUIDToFilename(payload.goodEnoughImages)" 
                      :label="$t('ui.view.createtask.goodenoughimageslabel')" 
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
                      :value="attachmentUUIDToFilename(payload.goalImages)" 
                      :label="$t('ui.view.createtask.goalimageslabel')" 
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
import OttraDocumentBrowser from '@/components/documentmanager/OttraDocumentBrowser'

import { DocumentMixin } from '@/views/creation/mixins/DocumentUUIDToFilename'


export default {
  name: "create-task",
  components: {
    OttraDocumentBrowser 
  },
  mixins: [ DocumentMixin ],
  props: [ 'task_uuid' ],
  data: function() {
    return {
      valid: '',
      dirty: false,
      payload: {
        subject: '',
        //uuid: '',
        body: '',
        //created: '',
        //creator: '',
        //steps: [],
        recurranceNumber: 1,
        recurranceType: 1,
        goodEnoughImages: [],
        goalImages: []
      },
      recurranceOptions: [
        { title: '(*) Day', option: this.RECURRANCE_DAY },
        { title: '(*) Week', option: this.RECURRANCE_WEEK },
        { title: '(*) Month', option: this.RECURRANCE_MONTH },
        { title: '(*) Year', option: this.RECURRANCE_YEAR },
      ],      
    }
  },
  computed: {
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
      const uuid = await this.$store.dispatch("createTask", this.payload)
      console.debug("%s: createTask success: %O", __filename, uuid)
      this.$router.push('/task/' + uuid)
    },
    // As this component will be used for editing, there will be a method for updateTask as well.
  }
}
</script>

