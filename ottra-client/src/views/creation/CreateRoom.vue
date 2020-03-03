<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.createroom.heading') }} 
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

      <form-wrapper :validator="$v.payload">
        <v-container fluid fill-height>
          <v-row align-center justify-center>
            <v-col cols="12">
              <v-form ref="form" v-model="valid">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-select 
                        :items="locations"
                        item-text="name"
                        item-value="uuid"
                        :value="location_uuid"
                        :label="$t('ui.view.locationview.heading')"
                        required
                        v-model="payload.location">
                      </v-select>
                     
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field 
                        v-model="payload.name" 
                        :label="$t('ui.text.name')" 
                        type="text" 
                        required>
                      </v-text-field>
                    </v-col>
                  </v-row>

<!--
                  <v-row>
                    <v-col>
                      (*) Do you want to add documents/images to the Room, either upload or pick from already uploaded images.

                      <v-checkbox v-model="showDocumentPicker"></v-checkbox>
                      <OttraFileUploadButtonAndDialog></OttraFileUploadButtonAndDialog>
                    </v-col>
                  </v-row>
-->
                  <v-row>
                    <v-col>
                      <OttraAccessEquipment v-model="payload.accessEquipment">
                      </OttraAccessEquipment>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
<!--
              <OttraHorizDocumentPicker v-if="showDocumentPicker"></OttraHorizDocumentPicker>
-->              
              <v-btn text @click="saveRoom">
                {{ $t('ui.view.createroom.saveroom') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </form-wrapper>
    </v-card-text>

    <v-tour name="CreateRoomTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

import OttraHorizDocumentPicker from '@/components/documentmanager/OttraHorizDocumentPicker'
import OttraFileUploadButtonAndDialog from '@/components/documentmanager/OttraFileUploadButtonAndDialog'
import OttraAccessEquipment from '@/components/locations/subcomponents/OttraAccessEquipment'


export default {
  name: "create-room",
  props: [ 'location_uuid'],
  components: {
    OttraHorizDocumentPicker,
    OttraFileUploadButtonAndDialog,
    OttraAccessEquipment
  },
  data: function() {
    return {
      payload: {
        name: '',
        location: '',
        accessEquipment: [],
      },
      valid: false,
      showDocumentPicker: false,
    }
  },
  mounted: function() {
    if (this.location_uuid) {
      this.payload.location = this.location_uuid
    }
  },
  validations: function() {
    return {
      payload: {
        name: {
          required,
          minLength: minLength(3)
        },
        location: {
          required,
          minLength: minLength(5)
        },
      }
    }
  },
  computed: {
    ...mapGetters([
      "getLocations"
    ]),
    locations: function() {
      return Object.values(this.getLocations)
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
    saveRoom: function() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.error("%s: Form is invalid", __filename)
      } else {
        // We should save the images here as well. 
        this.$store.dispatch("createRoom", this.payload)
        .then(() => {
          this.$router.push("/room")
        })
        .catch((err) => {
          console.error("%s: saveRoom failed: %s", __filename, error)
        })
      }
    },
    startTour: function() {
      this.$tours['CreateLocationTour'].start()
    },
    closeDialog: function() {
      this.$router.push('/room')
    }
  }
};
</script>

