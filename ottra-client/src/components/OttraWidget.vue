<template>
  <v-card class="elevation-3"> 

	  <v-card-title :class="[typeColor, defaultClass]">
	  	<slot name="title"> Title here </slot>
	    <v-spacer></v-spacer>
	    <v-icon color="black"> {{ widgetIcon }} </v-icon>                      
	  </v-card-title>

	  <v-card-text>
	  	<slot> Text here </slot>
	  </v-card-text>

	  <v-card-actions>
	  	<slot name="actions"> 
	    </slot>
	  </v-card-actions>

	</v-card>
</template>

<script>
export default {
	name: 'ottra-widget',
	props: ['type'],
	data: function() {
		return {
			defaultClass: [ 'elevation-1', 'title' ],
			widgetData: {
				create: {
					color: ['blue','lighten-4'],
					icon: 'create'
				},
				plan: {
					color: ['light-green', 'lighten-4'],
					icon: 'extension'
				},
				do: {
					color: ['orange', 'lighten-3'],
					icon: 'play_for_work'
				},
				evaluate: {
					color: ['purple', 'lighten-3'],
					icon: 'feedback'
				},
				info: {
					color: ['indigo', 'lighten-4'],
					icon: 'info'
				},
				warning: {
					color: ['red', 'lighten-3'],
					icon: 'report_problem'
				},
				critical: {
					color: 'red',
					icon: 'error_outline'
				},
			}
		}
	},
	computed: {
		typeColor: function() {
			return this.widgetData[this.type].color
		},
		widgetIcon: function() {
			return this.widgetData[this.type].icon
		},
	}
}
</script>