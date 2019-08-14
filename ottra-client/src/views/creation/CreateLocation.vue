<template>
	<div class="create_location">
		<h1 class="subheading"> {{ $t('ui.view.createlocation.heading') }} </h1>

    <v-stepper v-model="current_step" vertical>
      <v-stepper-step step="1" :complete="current_step > 1">
        {{ $t('ui.view.createlocation.chooselocation') }}
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-layout row>
              <v-flex xs12 md4>
                <v-text-field v-model="loc_name" :rules="stringRules" 
                  :label="$t('ui.text.name')" type="text" required>
                </v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12 sm6>
                <v-autocomplete
                    v-model="search_string"
                    :items="items"
                    item-text="description"
                    item-value="place_id"
                    :search-input.sync="search"
                    :loading="isLoading"
                    hide-no-data
                    no-filter
                    :rules="stringRules"
                    :label="$t('ui.text.address')"
                    :placeholder="$t('ui.view.createlocation.starttyping')"
                >
                </v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-btn color="primary" @click="fetchMoreInformation">
          {{ $t('ui.text.continue') }} </v-btn>
        <v-btn text>
          {{ $t('ui.text.cancel') }}
        </v-btn>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="current_step > 2">
        {{ $t('ui.text.save') }}
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-layout row>
              <v-flex xs12 md4>
                <v-text-field v-model="loc_street" :rules="stringRules" 
                  :label="$t('ui.text.street')" 
                  type="text" required>
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex md4>
                <v-text-field v-model="loc_postal_code" :rules="stringRules" 
                  :label="$t('ui.text.postalcode')" 
                  type="text" required>
                </v-text-field>
              </v-flex>
              <v-flex md8>
                <v-text-field v-model="loc_city" :rules="stringRules" 
                  :label="$t('ui.text.city')" 
                  type="text" required>
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 md4>
                <v-text-field v-model="loc_country" :rules="stringRules" 
                  :label="$t('ui.text.country')" 
                  type="text" required>
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-btn text @click="current_step = 1">{{ $t('ui.text.restart') }}</v-btn>
        <v-btn text @click="saveLocation">{{ $t('ui.view.createlocation.savelocation') }}</v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import { RepositoryFactory } from '@/common/repos/RepositoryFactory';
const LocRepo  = RepositoryFactory.get('location');  

export default {
  name: "create-location",
  data: () => ({
    snackbar: false,
    current_step: 1,
  	loc_name: '',
  	loc_street: '',
    loc_street_number: '',
  	loc_postal_code: '',
  	loc_city: '',
  	loc_country: '',
  	loc_place_id: '',
  	address: '',
    search_string: '', // Contains Google place_id
    isLoading: false,
    valid: false,
    search_hits: [],
    search: null,
    message: '',
    stringRules: [
      v => !!v || $t('ui.text.required')
    ],
  }),
  computed: {
    items() {
      return this.search_hits
    }
  },
  watch: {
    search (val) {
      console.log("CreateLocation.search: called with val = " + val)
      if (this.isLoading) 
        return

      console.log("CreateLocation.search: passed first obstacle")
      this.isLoading = true

      console.log("CreateLocation.search: Trying to fetch data")
      LocRepo.searchLocation(val)
      .then(res => {
        console.log(res.data)
        this.search_hits = res.data
      })
      .catch(err => {
        console.log("Error in watch: " + err)
      })
      .finally(() => (this.isLoading = false))
    }
  },
  methods: {
    saveLocation: function() {
    	console.log("SaveLocation called");
      console.log("Constructing payload: ")

      let payload = {
        name: this.loc_name,
        street: this.loc_street,
        postal_code: this.loc_postal_code,
        city: this.loc_city,
        country: this.loc_country,
        place_id: this.loc_place_id,
        geoloc: this.geolocation,
      }
      console.log(payload)
      this.$store.dispatch("createLocation", payload)
      .then(() => {
        this.snackbar = true
      })
      .catch((error) => {
        console.error("Call to createLocation failed: " + error)
      })
    }, 
    fetchMoreInformation: function() {
      console.log("Trying to fetch more information")
      LocRepo.findPlace(this.search_string)
      .then((result) => {
        // Parse address_components - should be broken out.

        console.log(result.data)
        let ac = result.data.address_components
        for (let i = 0; i < ac.length; i++) {
          if (ac[i].types.includes('postal_town')) {
            this.loc_city = ac[i].long_name
          }
          else if (ac[i].types.includes('country')) {
            this.loc_country = ac[i].long_name
          }
          else if (ac[i].types.includes('postal_code')) {
            this.loc_postal_code = ac[i].long_name
          }
        }
        this.loc_place_id = result.data.place_id
        this.loc_street = result.data.name
        this.geolocation = result.data.geometry.location
        this.current_step = 2
        console.log(result)
      })
      .catch((err) => {
        console.log("CreateLocation: LocRepo.findPlace failed: " + err)
      })
    }
  }
};
</script>

