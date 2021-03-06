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
            <v-layout row>
              <v-flex xs12 md4>
                <v-file-input 
                  prepend-icon="image"
                  v-model="files"
                  chips
                  multiple
                  :label="$t('ui.text.uploadfile')" 
                  v-on:change="printFileObjects">
                </v-file-input>
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
  data: function() {
    return {
      files: [],
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
        v => !!v || this.$i18n.t('ui.text.required')
      ],
    }
  },
  computed: {
    items() {
      return this.search_hits
    }
  },
  watch: {
    search (val) {
      this.$log.debug("CreateLocation.search: called with val = " + val)
      if (this.isLoading || !val) 
        return

      this.$log.debug("CreateLocation.search: passed first obstacle")
      this.isLoading = true

      this.$log.debug("CreateLocation.search: Trying to fetch data")
      LocRepo.searchLocation(val)
      .then(res => {
        this.$log.debug(__filename + ": Populating search_hits with ", res.data.predictions)
        this.search_hits = res.data.predictions
      })
      .catch(err => {
        this.$log.error("Error in watch: " + err)
      })
      .finally(() => (this.isLoading = false))
    }
  },
  methods: {
    printFileObjects: function(data) {
      console.log("%s: printFileObjects data: %O", __filename, data)
    },
    saveLocation: function() {
    	this.$log.debug("SaveLocation called");
      this.$log.debug("Constructing payload/formData: ")

      let payload = new FormData()

      payload.append('name', this.loc_name)
      payload.append('street', this.loc_street)
      payload.append('postal_code', this.loc_postal_code)
      payload.append('city', this.loc_city)
      payload.append('country', this.loc_country)
      payload.append('place_id', this.loc_place_id)
      payload.append('geoloc', this.geolocation)

      switch (this.files.length) {
        case 0: 
          // Do nothing
          break;
        case 1: 
          payload.append('images', this.files[0])
          break;
        default:
          for (const img of this.files) {
            payload.append('images', img)
          }
      }

/*
      let payload = {
        name: this.loc_name,
        street: this.loc_street,
        postal_code: this.loc_postal_code,
        city: this.loc_city,
        country: this.loc_country,
        place_id: this.loc_place_id,
        geoloc: this.geolocation,
        fileObjects: this.files
      }
*/      
      for (var pair of payload.entries())
      {
        console.log("%s: %s -> %O", __filename, pair[0], pair[1]); 
      }
      this.$store.dispatch("createLocation", payload)
      .then(() => {
        this.snackbar = true
      })
      .catch((error) => {
        this.$log.error("Call to createLocation failed: " + error)
      })
    }, 
    fetchMoreInformation: function() {
      this.$log.debug("Trying to fetch more information")
      LocRepo.findPlace(this.search_string)
      .then((result) => {
        // Parse address_components - should be broken out.

        this.$log.debug(__filename + ": fetchMoreInformation: ")
        this.$log.debug(result.data)
        const ac = result.data.result.address_components
        console.log("%s: fetchMoreInformation - ac is %O", __filename, ac)
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
        this.loc_place_id = result.data.result.place_id
        this.loc_street = result.data.result.name
        this.geolocation = result.data.result.geometry.location
        this.current_step = 2
        this.$log.debug(result)
      })
      .catch((err) => {
        this.$log.debug("CreateLocation: LocRepo.findPlace failed: " + err)
      })
    },

  }
};
</script>

