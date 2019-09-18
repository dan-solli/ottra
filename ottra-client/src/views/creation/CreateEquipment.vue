<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.createequipment.heading') }} 
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

                <v-stepper v-model="currentStep" vertical>
                  <v-stepper-step step="1" :complete="currentStep > 1">
                    {{ $t('ui.view.createequipment.step1.header') }}
                  </v-stepper-step>
                  <v-stepper-content step="1">
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-select 
                            :items="locations"
                            item-text="name"
                            item-value="uuid"
                            :value="container_uuid"
                            :label="$t('ui.view.locationview.heading')"
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
                          <v-btn color="primary" @click="nextStep">
                            {{ $t('ui.text.continue') }} </v-btn>
                          <v-btn text @click="closeDialog">
                            {{ $t('ui.text.cancel') }}
                          </v-btn>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-stepper-content>

                  <v-stepper-step step="2" :complete="currentStep > 2">
                    {{ $t('ui.view.createequipment.step2.header') }}
                  </v-stepper-step>
                  <v-stepper-content step="2">
                    <v-container>
                      <v-row>
                        <v-col>

                          <v-switch v-model="hasActions" 
                            :label="$t('ui.view.createequipment.step2.hasactions')">
                          </v-switch>
                          <v-switch v-model="hasSettings" 
                            :label="$t('ui.view.createequipment.step2.hassettings')">
                          </v-switch>
                          <v-switch v-model="isConsumable" 
                            :label="$t('ui.view.createequipment.step2.isconsumable')">
                          </v-switch>

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

                 <v-stepper-step :disabled="!hasActions" step="3" :complete="currentStep > 3">
                  {{ $t('ui.view.createequipment.step3.header') }}
                </v-stepper-step>
                <v-stepper-content step="3">
                  <v-container>
                    <v-row>
                      <v-col>

                        <v-text-field 
                          v-model="tempAction.name" 
                          :label="$t('ui.component.addaction.name')" 
                          type="text" 
                          required>
                        </v-text-field>

                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>

                        <v-select 
                          :items="tasks"
                          item-text="name"
                          item-value="uuid"
                          :label="$t('ui.component.task.heading')"
                          required
                          v-model="payload.container">
                        </v-select> 
                          {{ $t('ui.text.orcreate') }}  
                        <v-btn @click="newTask">
                          {{ $t('ui.button.newtask') }}
                        </v-btn>

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

                <v-stepper-step :disabled="!hasSettings" step="4" :complete="currentStep > 4">
                  {{ $t('ui.view.createequipment.step4.header') }}
                </v-stepper-step>

                <v-stepper-content step="4">
                  <v-container>
                    <v-row>
                      <v-col>

                        <v-text-field 
                          v-model="tempConfiguration.name" 
                          :label="$t('ui.component.addconfigurationtemplate.name')" 
                          type="text" 
                          required>
                        </v-text-field>

                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <v-btn @click="saveConfigurationTemplate">
                          {{ $t('ui.button.saveconfigurationtemplate') }}
                        </v-btn>
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

                <v-stepper-step :disabled="!isConsumable" step="5" :complete="currentStep > 5">
                  {{ $t('ui.view.createequipment.step5.header') }}
                </v-stepper-step>

                <v-stepper-content step="5">
                  <v-container>
                    <v-row>
                      <v-col>

                        <v-text-field 
                          v-model="consumable.currentAmount" 
                          :label="$t('ui.component.addconsumable.currentamount')" 
                          type="number" 
                          required>
                        </v-text-field>

                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>

                        <v-text-field 
                          v-model="consumable.tresholdWarning" 
                          :label="$t('ui.component.addconsumable.tresholdwarning')" 
                          type="number" 
                          required>
                        </v-text-field>

                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>

                        <v-text-field 
                          v-model="consumable.goalNumber" 
                          :label="$t('ui.component.addconsumable.goalnumber')" 
                          type="number" 
                          required>
                        </v-text-field>

                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>

                        <v-switch v-model="consumable.addAction" 
                          :label="$t('ui.component.addconsumable.addaction')">
                        </v-switch>

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

                <v-stepper-step step="6" :complete="currentStep > 6">
                  {{ $t('ui.view.createequipment.step6.header') }}
                </v-stepper-step>

                <v-stepper-content step="6">
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-checkbox v-model="showDocumentPicker"
                          label="(*) Do you want to add documents/images to the Room, either upload or pick from already uploaded images.">
                        </v-checkbox>
                        <OttraFileUploadButtonAndDialog></OttraFileUploadButtonAndDialog>
<!--
                      <OttraHorizDocumentPicker v-if="showDocumentPicker"></OttraHorizDocumentPicker>
-->                      
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>

                        <v-btn color="primary" @click="saveEquipment">
                          {{ $t('ui.view.createequipment.saveequipment') }}
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
      </form-wrapper>
    </v-card-text>

    <v-tour name="CreateEquipmentTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

import OttraHorizDocumentPicker from '@/components/documentmanager/OttraHorizDocumentPicker.vue'
import OttraFileUploadButtonAndDialog from '@/components/documentmanager/OttraFileUploadButtonAndDialog.vue'

export default {
  name: "create-equipment",
  props: [ 'container_uuid'],
  components: {
    OttraHorizDocumentPicker,
    OttraFileUploadButtonAndDialog
  },
  data: function() {
    return {
      currentStep: 1,
      payload: {
        name: '',
        container: '',
      },
      tempAction: {
        name: '',
      },
      tempConfiguration: {
        name: '',
      },
      consumable: {
        currentAmount: 0,
        tresholdWarning: 0,
        goalNumber: 0,
        addAction: false,
      },
      hasSettings: false,
      hasActions: false,
      isConsumable: false,
      valid: false,
      showDocumentPicker: false,
      tasks: [],
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
      }
    }
  },
  computed: {
    ...mapGetters([
      "getRooms",
      "getStorages"
    ]),
    locations: function() {
      const rooms = Object.values(this.getRooms)
      const storages = Object.values(this.getStorages)

      const result = []

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
    saveEquipment: function() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.error("%s: Form is invalid", __filename)
      } else {
        // We should save the images here as well. 
        this.$store.dispatch("createEquipment", this.payload)
        .then(() => {
          this.$router.push("/equipment")
        })
        .catch((err) => {
          console.error("%s: saveEquipment failed: %s", __filename, error)
        })
      }
    },
    startTour: function() {
      this.$tours['CreateEquipmentTour'].start()
    },
    closeDialog: function() {
      this.$router.push('/equipment')
    },
    nextStep: function() {
      console.debug("%s: nextStep: currentStep is %d", __filename, this.currentStep)
      this.currentStep = this.currentStep + 1
      if (this.currentStep == 3 && !this.hasActions) {
        this.currentStep = this.currentStep + 1
      }
      if (this.currentStep == 4 && !this.hasSettings) {
        this.currentStep = this.currentStep + 1
      }
      if (this.currentStep == 5 && !this.isConsumable) {
        this.currentStep = this.currentStep + 1
      }
    },
    newTask: function() {
      // Foo for now
    },
    saveConfigurationTemplate: function() {
      // Foo for now
    },
  }
};
</script>

