<template>
	<v-navigation-drawer v-bind:value="value" v-on:input="$emit('input', $event)" app>
    <v-list v-for="(section, s) in getNavigationDrawerItems" :key="s">
    	<v-list-item v-for="(list, l) in section" :key="l" router :to="list.route">
    		<v-list-item-action>
    			<v-icon> {{ list.icon }} </v-icon>
    		</v-list-item-action>
    		<v-list-item-content>
    			<v-list-item-title> {{ list.title }} </v-list-item-title>
    		</v-list-item-content>
    	</v-list-item>
    	<v-divider v-if="section.length > 0"></v-divider>
	  </v-list>
	</v-navigation-drawer>	
</template>

<script>

import { mapGetters } from "vuex"

export default {
	name: 'ottra-navigation-drawer',
	props: {
		value: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters([
			"getNavigationDrawerItems"
		])
	},
	created() {
		this.$store.dispatch("setDefaultItems", [
      { 
        title: this.$t('ui.navigation_drawer.default.dashboard'), 
        route: '/dashboard',
        icon: 'dashboard'
      },
      { 
        title: this.$t('ui.navigation_drawer.default.mail'), 
        route: '/messages',
        icon: 'mail'
      },
      { 
        title: this.$t('ui.navbar.filebrowser.tooltip'), 
        route: '/filebrowser',
        icon: 'mdi-file-document-outline'
      }
    ])
	}
}
</script>