<template>
	<OttraNormalView view-color="blue lighten-4"> 
		<template v-slot:toolbar-title> 
			{{ $t('ui.mode.create.view.base.heading') }} 
		</template>

		<template v-slot:toolbar-leftside>
			<v-tabs centered background-color="blue lighten-4">
				<v-tab v-for="(tab, i) in tabs" :key="i" :to="tab.route">
					{{ tab.name }}
				</v-tab>
			</v-tabs>
		</template>

		<template v-slot:toolbar-rightside>
			<v-text-field v-model="search" solo flat 
					:label="$t('ui.text.search')" hide-details prepend-inner-icon="mdi-magnify"
					clearable clear-icon="mdi-close-circle-outline">
			</v-text-field>
		</template>			

		<template v-slot:activeTab="slotTab">
			{{ slotTab }}
		</template>

		<template v-slot:main-content>
			<router-view></router-view>
		</template>			
	</OttraNormalView>
</template>

<script>
import { APPMODE_CREATE } from '@/common/appmode.types'
import OttraNormalView from '@/components/layout/normalView.vue'

export default {
	name: 'create-base-view',
	components: {
		OttraNormalView
	},
	data: function() {
		return {
			search: '',
			tabs: [
				{
					name: this.$t('ui.view.locationview.heading'),
					route: "/location"
				},
				{
					name: this.$t('ui.view.roomview.heading'),
					route: "/room"
				},
				{
					name: this.$t('ui.view.storageview.heading'),
					route: "/storage"
				},
				{
					name: this.$t('ui.view.equipmentview.heading'),
					route: "/equipment"
				},
				{
					name: this.$t('ui.view.taskview.heading'),
					route: "/task"
				},
				{
					name: this.$t('ui.view.scheduleview.heading'),
					route: "/schedule"
				},
			]
		}
	},
	created() {
		this.$store.dispatch("setMode", APPMODE_CREATE)
		this.$store.dispatch("setModeItems", [
			{
        title: this.$t('ui.navigation_drawer.mode.create.location'), 
        route: '/location/new',
        icon: 'mdi-map-marker'
			},
			{
        title: this.$t('ui.navigation_drawer.mode.create.room'), 
        route: '/room/new',
        icon: 'texture-box'
			},
			{
        title: this.$t('ui.navigation_drawer.mode.create.storage'), 
        route: '/storage/new',
        icon: 'mdi-file-cabinet'
			},
			{
        title: this.$t('ui.navigation_drawer.mode.create.equipment'), 
        route: '/equipment/new',
        icon: 'mdi-tools'
			}
		])
	}
}
</script>

