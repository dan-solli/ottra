<template>
  <div>
    <v-toolbar flat color="white" class="elevation-1 mt-4">
      <v-toolbar-title>
        {{ $t('ui.view.storageview.heading') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn color="primary" class="mb-2" :to="{ name: 'new_storage'}">
        {{ $t('ui.view.storageview.newstorage') }}
      </v-btn>
     
    </v-toolbar>

    <OttraLocationTree></OttraLocationTree>

  </div>
</template>

<script>
import { mapGetters } from "vuex";

import OttraLocationTree from '@/components/locations/OttraLocationTree'

export default {
  name: 'storage-view',
  components: {
    OttraLocationTree,
  },
  data: function() {
    return {
      rootNodes: [],
      tree: []
    }
  },

/*  
  async mounted() {
    await Promise.all([
      this.$store.dispatch("loadLocations"),
      this.$store.dispatch("loadStorages"),
      this.$store.dispatch("loadRooms"),
      this.$store.dispatch("loadEquipment")
    ])
  },
*/

/*  
  computed: {
    ...mapGetters([
      "getStorages",
      "getEquipment",
      "getRooms",
      "getLocations",
      "getRoomByID",
      "getStorageByID",
      "getEquipmentByID"
    ]),
    storageAndEquipment: function() {
      return Object.values(this.getStorages).concat(Object.values(this.getEquipment))
    },
    items: function() {
      if (this.rootNodes.length < 1) {
        this.rootNodes = Object.values(this.getRooms).map(function(item) {
          const struct = {
            id: item.uuid,
            name: item.name,
            type: item.type,
            icon: 'mdi-floor-plan',
            children: []
          }
          return struct
        })
      } 
      return this.rootNodes
    },
  }, 
*/

  methods: {
    loadChildren(parent) {
      console.debug("%s: loadChildren called with parent %O", __filename, parent)
      const offspring = this.getObjectsByParent(parent.id).map(function(item) {
        const struct = {
          id: item.uuid,
          name: item.name,
          type: item.type,
          icon: (item.type.includes('Storage') ? 
            'mdi-package-variant' : 
            'mdi-square-medium')
        }
        if (!item.type.includes('Equipment')) {
          struct.children = []
        }
        return struct
      })
      if (offspring.length > 0) {
        parent.children.push(...offspring)
      } else {
        this.$delete(parent, 'children')
      }
    },
    getObjectsByParent(parent_id) {
      const result = this.storageAndEquipment.filter(function(item) {
        if (item.location.uuid === parent_id) {
          return item
        } else {
          return null
        }
      })
      return result
    },
    editItem (item) {
    },
    deleteItem (item) {
      const index = this.storages.indexOf(item)
      confirm(this.$t('ui.dialog.confirmdelete')) && this.storages.splice(index, 1)
    },
    addStorage(item) {
      console.debug("%s: addStorage got item: %O", __filename, item)
      this.$router.push("/storage/new/" + item.id)
    },
    addEquipment(item) {
      console.debug("%s: addEquipment got item: %O", __filename, item)
      this.$router.push("/equipment/new/" + item.id)
    },
  }
}

</script>