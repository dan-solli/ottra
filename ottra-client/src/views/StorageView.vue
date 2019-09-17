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

    <v-treeview :items="storages"></v-treeview>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'storage-view',
  data: function() {
    return {
    }
  },

  computed: {
    ...mapGetters([
      "getStorages"
    ]),
    storages: function() {
      return Object.values(this.getStorages)
    },
    items: []
  },
  methods: {
    editItem (item) {
    },
    deleteItem (item) {
      const index = this.storages.indexOf(item)
      confirm(this.$t('ui.dialog.confirmdelete')) && this.storages.splice(index, 1)
    },
    addStorage(item) {
      // foo
    },
  }
}
</script>