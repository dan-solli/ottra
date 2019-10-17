<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.edittask.heading') }} 
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
                  <v-col>
                    <OttraRecurringTask
                      v-on:set-recurrance-how-often="payload.recurranceEvery = $event"
                      v-on:set-recurrance-what="payload.recurranceType = $event">
                    </OttraRecurringTask>
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

export default {
  name: "create-task",
  components: {
    OttraRecurringTask
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
        recurranceType: 1
      },
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
      const result = await this.$store.dispatch("saveTask", this.payload)
      console.debug("%s: saveTask success: %O", __filename, result)
      this.$router.push('/task/' + result.uuid)
    }
  }
}
</script>

