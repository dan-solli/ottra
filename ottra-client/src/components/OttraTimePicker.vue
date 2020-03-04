<template>
	<div class="text-center">
		<v-menu
		  ref="timepicker"
		  v-model="menu"
		  :close-on-content-click="false"
		  :return-value.sync="localTime"
		  transition="scale-transition"
		  offset-y
		  min-width="290px"
		>
		  <template v-slot:activator="{ on }">
		    <v-text-field
		      v-model="localTime"
		      :label="timeLabel"
		      :hint="timeHint"
		      prepend-icon="access_time"
		      readonly
		      v-on="on"
		      v-on:change="$emit('set-time', localTime)"
		    ></v-text-field>
		  </template>
		  <v-time-picker 
		  	v-model="localTime"
		  	format="24hr"
		  	scrollable
		  	v-on:change="$emit('set-time', localTime)">
		    <div class="flex-grow-1"></div>
		    <v-btn text color="primary" @click="menu = false">(*)Cancel</v-btn>
		    <v-btn text color="primary" @click="$refs.timepicker.save(localTime)">(*)OK</v-btn>
		  </v-time-picker>
		</v-menu>
	</div>
</template>


<script>
export default {
	name: 'ottra-time-picker',
	props: {
		value: {
			default: '',
			//type: String
		},
		timeLabel: {
			default: '(*) Time',
			type: String,
		},
		timeHint: {
			default: '(*) Time',
			type: String,
		},
	},
	data: function() {
		return {
			menu: '',
		}
	},
	computed: {
		localTime: {
			get() { return this.value },
			set(localTime) { this.$emit('input', localTime) }
		}
	},
	mounted: function() {
		// This is just wrong. Why would I need to use nextTick?!
		this.$nextTick(() => {
			console.debug("%s: Setting time (%s)", __filename, this.time)
			this.localTime = this.time
		})
	},
}

</script>	