<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>
        {{ $t('ui.view.locationview.heading') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn color="primary" class="mb-2" :to="{ name: 'new_location'}">
        {{ $t('ui.view.locationview.newlocation') }}
      </v-btn>
<!-- I like this dialog, but it's not appropriate all the time. Like now.       
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on"> (*) New Item</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.Name" label="(*) Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.Street" label="(*) Street"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.City" label="(*) City"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.Rooms" label="(*) Number of Rooms">
                    {{ editedItem.Rooms.length }}
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
-->      
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="locations"
      item-key="uuid"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <td>{{ props.item.Name }}</td>
          <td class="text-xs-left">{{ props.item.Address.Street }}</td>
          <td class="text-xs-left">{{ props.item.Address.City }}</td>
          <td class="text-xs-left">{{ props.item.Rooms.length }}</td>
          <td class="justify-center layout px-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="editItem(props.item)">add</v-icon>
              </template>
              {{ $t('ui.tooltip.add') }}
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="editItem(props.item)">cloud</v-icon>
              </template>
              {{ $t('ui.tooltip.weather') }}
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="editItem(props.item)">edit</v-icon>
              </template>
              {{ $t('ui.text.edititem') }}
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small @click.stop="deleteItem(props.item)">delete</v-icon>
              </template>
              {{ $t('ui.tooltip.delete') }}
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        {{ $t('ui.text.nodata') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

  export default {
    name: 'location-view',
    data: () => ({
      dialog: false,
      headers: [
        { 
          text: $t('ui.text.name'),
          align: 'left',
          sortable: true,
          value: 'Name'
        },
        {
          text: $t('ui.text.street'),
          align: 'left',
          sortable: true,
          value: 'Street'
        },
        {
          text: $t('ui.text.city'),
          align: 'left',
          sortable: true,
          value: 'City'
        },
        {
          text: $t('ui.text.rooms'),
          align: 'left',
          sortable: true,
          value: 'Rooms'
        }, 
        {
          text: $t('ui.text.actions'),
          align: 'left',
          value: 'Actions'
        }
      ],
      locations: [],
      editedIndex: -1,
      editedItem: {
        Name: '',
        Address: {
          Street: '',
          City: ''
        },
        Rooms: [],
      },
      defaultItem: {
        Name: '',
        Address: {
          Street: '',
          City: ''
        },
        Rooms: [],
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? $t('ui.text.newitem') : $t('ui.text.edititem')
      },
      ...mapGetters([
        "getLocations"
      ])
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.locations = Object.values(this.getLocations)
      },

      editItem (item) {
        this.editedIndex = this.locations.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.locations.indexOf(item)
        confirm($t('ui.dialog.confirmdelete')) && this.locations.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.locations[this.editedIndex], this.editedItem)
        } else {
          this.locations.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>