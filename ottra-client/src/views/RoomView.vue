<template>
  <div>
    <v-toolbar flat color="white" class="elevation-1 mt-4">
      <v-toolbar-title>
        {{ $t('ui.view.roomview.heading') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn color="primary" class="mb-2" :to="{ name: 'new_room'}">
        {{ $t('ui.view.roomview.newroom') }}
      </v-btn>
     
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="rooms"
      item-key="uuid"
      class="elevation-1"
    >
      <template v-slot:item="props">
        <tr @click="props.expanded = !props.expanded">
          <td>{{ props.item.name }}</td>
<!--          
          <td class="text-xs-left">{{ props.item.Address.Street }}</td>
          <td class="text-xs-left">{{ props.item.Address.City }}</td>
          <td class="text-xs-left">{{ props.item.Rooms.length }}</td>
-->          
          <td class="justify-left layout px-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="addEquipment(props.item)">mdi-toolbox-outline</v-icon>
              </template>
              {{ $t('ui.tooltip.addequipment') }}
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="addStorage(props.item)">mdi-package-variant</v-icon>
              </template>
              {{ $t('ui.tooltip.addstorage') }}
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
  name: 'room-view',
  data: function() {
    return {
      dialog: false,
      headers: [
        { 
          text: this.$i18n.t('ui.text.name'),
          align: 'left',
          sortable: true,
          value: 'Name'
        },
/*        
        {
          text: this.$i18n.t('ui.text.street'),
          align: 'left',
          sortable: true,
          value: 'Street'
        },
        {
          text: this.$i18n.t('ui.text.city'),
          align: 'left',
          sortable: true,
          value: 'City'
        },
        {
          text: this.$i18n.t('ui.text.rooms'),
          align: 'left',
          sortable: true,
          value: 'Rooms'
        }, 
*/        
        {
          text: this.$i18n.t('ui.text.actions'),
          align: 'left',
          value: 'Actions'
        }

      ],
    }
  },
  async mounted() {
    await this.$store.dispatch("loadRooms")
  },
  computed: {
    ...mapGetters([
      "getRooms"
    ]),
    rooms: function() {
      return Object.values(this.getRooms)
    }
  },
  methods: {
    editItem (item) {
    },
    deleteItem (item) {
      const index = this.rooms.indexOf(item)
      confirm(this.$t('ui.dialog.confirmdelete')) && this.rooms.splice(index, 1)
    },
    addStorage(item) {
      this.$router.push("/storage/new/" + item.uuid)
    },
    addEquipment(item) {
      this.$router.push("/equipment/new/" + item.uuid)
    },
  }
}
</script>