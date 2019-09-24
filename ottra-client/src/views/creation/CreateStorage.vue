<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.createstorage.heading') }} 
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
                        :items="containers"
                        item-text="name"
                        item-value="uuid"
                        :value="container_uuid"
                        :label="$t('ui.view.storageview.heading')"
                        required
                        v-model="payload.container">
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

                  <v-row>
                    <v-col>
                      <v-switch
                        v-model="payload.mobile" 
                        :label="$t('ui.view.createstorage.ismobile')" 
                        required>
                      </v-switch>
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

                </v-container>
              </v-form>
<!--
              <OttraHorizDocumentPicker v-if="showDocumentPicker"></OttraHorizDocumentPicker>
-->              
              <v-btn text @click="saveStorage">
                {{ $t('ui.view.createstorage.savestorage') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </form-wrapper>
    </v-card-text>

    <v-tour name="CreateStorageTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

import OttraHorizDocumentPicker from '@/components/documentmanager/OttraHorizDocumentPicker.vue'
import OttraFileUploadButtonAndDialog from '@/components/documentmanager/OttraFileUploadButtonAndDialog.vue'

export default {
  name: "create-storage",
  props: [ 'container_uuid'],
  components: {
    OttraHorizDocumentPicker,
    OttraFileUploadButtonAndDialog
  },
  data: function() {
    return {
      payload: {
        name: '',
        container: '', // This can be a room or another storage.
        mobile: false, // Handbag, purse etc
      },
      valid: false,
      showDocumentPicker: false,
    }
  },
  mounted: function() {
    if (this.container_uuid) {
      this.payload.container = this.container_uuid
    }
  },
  validations: function() {
    return {
      payload: {
        name: {
          required,
          minLength: minLength(3)
        },
        container: {
          required,
          minLength: minLength(5)
        },
        mobile: {
          required
        },
      }
    }
  },
  computed: {
    ...mapGetters([
      "getRooms",
      "getStorages"
    ]),
    containers: function() {
      // This one has to be a bit smarter
      const rooms = Object.values(this.getRooms)
      const storages = Object.values(this.getStorages)

      const result = []

      // Maybe figure out what I would like it to look like. Maybe don't care at this point.
      // return Object.values(this.getRooms).concat(Object.values(this.getStorages))
      return result.concat(rooms)
        .concat([ { name: 'Foo', divider: true, uuid: 'bar' }])
        .concat(storages)
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
    saveStorage: function() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.error("%s: Form is invalid", __filename)
      } else {
        // We should save the images here as well. 
        this.$store.dispatch("createStorage", this.payload)
        .then(() => {
          this.$router.push("/storage")
        })
        .catch((err) => {
          console.error("%s: saveStorage failed: %s", __filename, error)
        })
      }
    },
    startTour: function() {
      this.$tours['CreateLocationTour'].start()
    },
    closeDialog: function() {
      this.$router.push('/storage')
    }
  }
};
</script>
