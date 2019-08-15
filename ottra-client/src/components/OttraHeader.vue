<template>
  <div class="ottra_header"> 
		<nav>      
			<v-app-bar 
	      flat
	      app
	      dense
	      :prominent="show_toolbar_extension"
	      :extended="show_toolbar_extension">

				<v-app-bar-nav-icon @click="navigation_drawer = !navigation_drawer">
				</v-app-bar-nav-icon>

		    <v-toolbar-title> Ottra </v-toolbar-title>

		    <v-toolbar-items v-if="isAuthenticated" class="mx-5 px-5">

		    	<v-tooltip bottom>
		    		<template v-slot:activator="{ on }">
			    		<v-btn text v-on="on">
			    			<v-icon>create</v-icon>
			    			<span class="pl-2 hidden-md-and-down">
			    				{{ $t('ui.navbar.create') }}
			    			</span>
			    		</v-btn>
			    	</template>
			    	<span> {{ $t('ui.navbar.create') }} </span>
					</v-tooltip>

		    	<v-tooltip bottom>
		    		<template v-slot:activator="{ on }">
			    		<v-btn text v-on="on">
			    			<v-icon>calendar_today</v-icon>
			    			<span class="pl-2 hidden-md-and-down">
			    				{{ $t('ui.navbar.plan') }}
			    			</span>
			    		</v-btn>
			    	</template>
			    	<span> {{ $t('ui.navbar.plan') }} </span>
					</v-tooltip>

		    	<v-tooltip bottom>
		    		<template v-slot:activator="{ on }">
			    		<v-btn text v-on="on">
			    			<v-icon>play_arrow</v-icon>
			    			<span class="pl-2 hidden-md-and-down">	    			
			    				{{ $t('ui.navbar.do') }}
			    			</span>
			    		</v-btn>
			    	</template>
			    	<span> {{ $t('ui.navbar.do') }} </span>
					</v-tooltip>

		    	<v-tooltip bottom>
		    		<template v-slot:activator="{ on }">
			    		<v-btn text v-on="on">
			    			<v-icon>redo</v-icon>
			    			<span class="pl-2 hidden-md-and-down">	    			
			    				{{ $t('ui.navbar.check') }}
			    			</span>
			    		</v-btn>
			    	</template>
			    	<span> {{ $t('ui.navbar.check') }} </span>
					</v-tooltip>
		    </v-toolbar-items>


				<v-spacer></v-spacer>

	      <v-toolbar-items>
		    	<v-tooltip v-if="isAuthenticated" bottom>
		    		<template v-slot:activator="{ on }">
	      		  <v-btn text to="/messages" v-on="on">
							  <v-badge color="blue" overlap>
							    <template v-slot:badge>
							      <span> {{ getMessageUnreadCount }} </span>
							    </template>
							    <v-icon color="black">mail</v-icon>
						  	</v-badge>
							</v-btn>
			    	</template>
			    	<span> {{ $t('ui.navbar.inbox.tooltip') }} </span>
					</v-tooltip>

		    	<v-tooltip v-if="isAuthenticated" bottom>
		    		<template v-slot:activator="{ on }">
					    <v-btn text to="/weather" v-on="on">
						    <v-icon>cloud</v-icon>
							</v-btn>		
			    	</template>
			    	<span> {{ $t('ui.navbar.weather.tooltip') }} </span>
					</v-tooltip>

			    <v-btn v-if="!isAuthenticated" text to='/login'>
			      <span>
			      	{{ $t('ui.navbar.login') }}
			      </span> 
			      <v-icon right>verified_user</v-icon>
			    </v-btn>
			    <v-btn text v-if="isAuthenticated" to='/settings'>
			      <v-icon>person</v-icon>
			    </v-btn>
			    <v-btn text v-if="isAuthenticated" @click="logoutUserButton">
			    	Logout
			    </v-btn>
 
	      </v-toolbar-items>
			</v-app-bar>

	  </nav>

	  <OttraNavigationDrawer v-model="navigation_drawer" app>
	  </OttraNavigationDrawer>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";

import OttraNavigationDrawer from '@/components/OttraNavigationDrawer'

export default {
  name: "ottra-navbar",
  components: {
  	OttraNavigationDrawer
  },
  computed: {
  		...mapGetters([ 
  			"isAuthenticated",
  			"getMessageUnreadCount"
  		])
  },
  data() {
  	return {
  		navigation_drawer: false,
      show_toolbar_extension: false,
      toggle_mode: null
  	}
  },
  methods: {
  	logoutUserButton() {
  		this.$store.dispatch("logoutUser")
  		this.$router.push({ name: "start" })
  	},
    showInputField: function() {
      this.show_toolbar_extension = true
    },
    saveNewTodo: function() {
      alert("Saving new Todo: " + this.newTodo)
      this.show_toolbar_extension = false
      this.newTodo = ''
    },
    cancelNewTodo: function() {
      this.show_toolbar_extension = false
      this.newTodo = ''
    },
    viewSettings: function() {
      this.$router.push({ name: "settings" })
    }    
  }
};
</script>
