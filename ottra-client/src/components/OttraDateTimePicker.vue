<template>
	<div class="text-center">
		<v-menu
		  ref="datepicker"
		  v-model="menu"
		  :close-on-content-click="false"
		  :return-value.sync="localDate"
		  transition="scale-transition"
		  offset-y
		  min-width="290px"
		>
		  <template v-slot:activator="{ on }">
		    <v-text-field
		      v-model="localDate"
		      label="(*)Date"
		      prepend-icon="event"
		      readonly
		      v-on="on"
		    ></v-text-field>
		  </template>
		  <v-date-picker v-model="localDate" scrollable>
		    <div class="flex-grow-1"></div>
		    <v-btn text color="primary" @click="menu = false">(*)Cancel</v-btn>
		    <v-btn text color="primary" @click="$refs.datepicker.save(localDate)">(*)OK</v-btn>
		  </v-date-picker>
		</v-menu>

		<v-menu
		  ref="timepicker"
		  v-model="menu2"
		  :close-on-content-click="false"
		  :return-value.sync="localTime"
		  transition="scale-transition"
		  offset-y
		  min-width="290px"
		>
		  <template v-slot:activator="{ on }">
		    <v-text-field
		      v-model="localTime"
		      label="(*)Time"
		      prepend-icon="access_time"
		      readonly
		      v-on="on"
		    ></v-text-field>
		  </template>
		  <v-time-picker v-model="localTime" format="24hr" scrollable>
		    <div class="flex-grow-1"></div>
		    <v-btn text color="primary" @click="menu2 = false">(*)Cancel</v-btn>
		    <v-btn text color="primary" @click="$refs.timepicker.save(localTime)">(*)OK</v-btn>
		  </v-time-picker>
		</v-menu>
	</div>
</template>


<script>
export default {
	name: 'ottra-datetime-picker',
/*	
	props: [
		dateProp, 
		timeProp
	],
*/	
	data: function() {
		return {
			menu: '',
			menu2: '',
			localDate: '',
			localTime: '',
		}
	}
}

</script>	