<template>
  <v-card>
    <v-card-title>
      {{ $t('ui.view.createlocation.heading') }} 
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
              <v-stepper v-model="current_step" vertical>
                <v-stepper-step step="1" :complete="current_step > 1">
                  {{ $t('ui.view.createlocation.chooselocation') }}
                </v-stepper-step>

                <v-stepper-content step="1">
                  <v-form ref="form" v-model="valid">
                    <v-container>
                      <v-row>
                        <v-col cols="4">
                          <v-text-field v-model="payload.name" 
                            :label="$t('ui.text.name')" type="text" required>
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6">
                          <v-autocomplete
                              v-model="search_string"
                              :items="items"
                              item-text="description"
                              item-value="place_id"
                              :search-input.sync="search"
                              :loading="isLoading"
                              hide-no-data
                              no-filter
                              :label="$t('ui.text.address')"
                              :placeholder="$t('ui.view.createlocation.starttyping')"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                  <v-btn color="primary" @click="fetchMoreInformation">
                    {{ $t('ui.text.continue') }} </v-btn>
                  <v-btn text>
                    {{ $t('ui.text.cancel') }}
                  </v-btn>
          <!--        
                  <OttraHorizDocumentPicker></OttraHorizDocumentPicker>
          -->        
                </v-stepper-content>

                <v-stepper-step step="2" :complete="current_step > 2">
                  {{ $t('ui.text.save') }}
                </v-stepper-step>

                <v-stepper-content step="2">
                  <v-form ref="form" v-model="valid">
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field v-model="payload.address" :label="$t('ui.text.address')">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                  <v-btn text @click="current_step = 1">
                    {{ $t('ui.text.restart') }}
                  </v-btn>
                  <v-btn text @click="saveLocation">
                    {{ $t('ui.view.createlocation.savelocation') }}
                  </v-btn>
                </v-stepper-content>
              </v-stepper>
            </v-col>
          </v-row>
        </v-container>
      </form-wrapper>
    </v-card-text>

    <v-tour name="CreateLocationTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-card>
</template>

<script>

import { required, minLength } from 'vuelidate/lib/validators'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory';
const LocRepo  = RepositoryFactory.get('location');  

import OttraHorizDocumentPicker from '@/components/documentmanager/OttraHorizDocumentPicker.vue'

export default {
  name: "create-location",
  components: {
    OttraHorizDocumentPicker
  },
  data: function() {
    return {
      payload: {
        name: '',
        address: '',
        place_id: '',
        country: '',
        maps_url: '',
        phone_nr: '',
        latitude: 0,
        longitude: 0
      },
      current_step: 1,
      search_string: '', // Contains Google place_id
      isLoading: false,
      valid: false,
      search_hits: [],
      search: null,
      message: '',
    }
  },
  validations: function() {
    return {
      payload: {
        name: {
          required,
          minLength: minLength(3)
        },
        address: {
          required
        },
      }
    }
  },
  computed: {
    items() {
      return this.search_hits
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
      /* This one should have two separate tours. Bonus points if it can simulate the workings and then roll it all back. */
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
  watch: {
    search (val) {
      console.debug("%s: In search, got %s", __filename, val)
      if (this.isLoading || !val) 
        return

      console.debug("%s: search() passed first obstacle", __filename)
      this.isLoading = true

      console.debug("%s: search() Trying to fetch data", __filename)
      LocRepo.searchLocation(val)
      .then(res => {
        console.debug("%s: Populating search_hits with %O", __filename, res.data.predictions)
        this.search_hits = res.data.predictions
      })
      .catch(err => {
        console.error("%s: Error in watch: %s", __filename, err)
      })
      .finally(() => (this.isLoading = false))
    }
  },
  methods: {
    saveLocation: function() {
      this.$store.dispatch("createLocation", this.payload)
      .then(() => {
        this.$router.push("/location")
      })
      .catch((err) => {
        console.error("%s: saveLocation failed: %s", __filename, error)
      })
    },
/*      
      let payload = new FormData()

      payload.append('name', this.payload.name)
      payload.append('address', this.payload.address)
      payload.append('geoloc', this.payload.geolocation)
      payload.append('place_id', this.payload.place_id)
      payload.append('country', this.payload.country)
      payload.append('maps_url', this.payload.maps_url)

      this.$store.dispatch("createLocation", payload)
      .then(() => {
        this.snackbar = true
      })
      .catch((error) => {
        this.$log.error("Call to createLocation failed: " + error)
      })
    }, 
*/    
    fetchMoreInformation: function() {
      LocRepo.findPlace(this.search_string)
      .then((result) => {
        // Parse address_components - should be broken out.

        console.debug("%s: fetchMoreInformation: %O", __filename, result.data)
        const ac = result.data.result.address_components
        for (let i = 0; i < ac.length; i++) {
          if (ac[i].types.includes('country')) {
            this.payload.country = ac[i].long_name
          }
        }
        this.payload.place_id = result.data.result.place_id
        this.payload.address = result.data.result.formatted_address
        this.payload.phone_nr = result.data.result.international_phone_number
        this.payload.latitude = result.data.result.geometry.location.lat
        this.payload.longitude = result.data.result.geometry.location.lng
        this.payload.maps_url = result.data.result.url
        this.current_step = 2
      })
      .catch((err) => {
        this.$log.debug("CreateLocation: LocRepo.findPlace failed: " + err)
      })
      console.debug("%s: Stored payload is: %O", __filename, this.payload)
    },
    startTour: function() {
      this.$tours['CreateLocationTour'].start()
    },
    closeDialog: function() {
      this.$router.push('/location')
    }
  }
};
</script>

