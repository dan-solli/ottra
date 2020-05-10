<template>

	<v-card class="mx-auto">
		<v-sheet class="mx-5 py-3">
			<v-text-field
				v-model="search"
				:label="$t('ui.component.locationtree.searchlabel')"
				flat
				hide-details
				clearable
				clear-icon="mdi-close-circle-outline">
			</v-text-field>
		</v-sheet>
		<v-card-text>

	<v-treeview
		v-model="tree"
		hoverable
		dense
		activatable
		return-object
		:items="items"
		:search="search"
		@update:active="selectedNode">

		<template v-slot:prepend="{ item }">
			<v-icon> {{ item.icon }} </v-icon>
		</template>

		<!-- It's live, but it's wrong... -->
		<template v-slot:append="{ item }">
      <v-menu v-if="item.type !== 'equipment'" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn test icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="item.type === 'location'">
            <v-list-item-title @click="addRoom(item)">
              {{ $t('ui.tooltip.addroom') }} 
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="item.type === 'storage' || item.type === 'room'">
            <v-list-item-title @click="addStorage(item)">
              {{ $t('ui.tooltip.addstorage') }} 
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="item.type === 'storage' || item.type === 'room'">
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

  	</v-card-text>
  </v-card>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'ottra-location-tree',
	data: function() {
		return {
			tree: [],
			search: null,
			loading: false
		}
	},
	async created() {
		this.loading = true
		await Promise.all([
			this.$store.dispatch("loadLocations"),
			this.$store.dispatch("loadRooms"),
			this.$store.dispatch("loadStorages"),
			this.$store.dispatch("loadEquipment")
		])
		this.loading = false
	},
	computed: {
		...mapGetters([
			"getLocations",
			"getLocationTreeNodeById",
		]),
		items: function() {
			if (this.loading) {
				return []
			}
			const locs = Object.keys(this.getLocations) 
			return locs.map(function(f) {
				const result = this.getLocationTreeNodeById(f)
				return result
			}, this) 
		}
	},
	methods: {
		selectedNode: function(node) {
			console.debug("%s: selectedNode called with node %O", __filename, node)
		}
	}
}

</script>