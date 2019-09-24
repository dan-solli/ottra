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

    <v-treeview 
      v-model="tree"
      hoverable
      dense 
      :items="items"
      :loadChildren="loadChildren">
      <template v-slot:prepend="{ item }">
        <v-icon> {{ item.icon }} </v-icon>
      </template>
      <template v-slot:append="{ item }">
        <v-menu v-if="!item.type.includes('Equipment')" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn test icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title @click="addStorage(item)">
                {{ $t('ui.tooltip.addstorage') }} 
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="addEquipment(item)">
                {{ $t('ui.tooltip.addequipment') }} 
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:label="{ item }">
        {{ item.name }}
      </template>
    </v-treeview>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'storage-view',
  data: function() {
    return {
      rootNodes: [],
      tree: []
    }
  },
  computed: {
    ...mapGetters([
      "getStorages",
      "getEquipment",
      "getRooms"
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
  methods: {
    loadChildren(parent) {
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

/*
Rooms are always top level items. They can include
  - Equipment
  - Storage

Storage are intermediate to bottom level items. They can include
  - Equipment
  - Storage

Equipment are always bottom level items. They cannot include anything.

Pseudo-code:

Add rooms as top-level items, give them an empty children: []
Iterate over storages:
  - Build an item, give empty children: []. 
  - Add the structure to a lookup-map
Iterate over equipment:
  - Build an item, no children.
  - Add the structure to a lookup-map
*/
</script>