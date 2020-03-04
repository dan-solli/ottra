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
		      :label="dateLabel"
		      :hint="dateHint"
		      prepend-icon="event"
		      readonly
		      v-on="on"
		      v-on:change="$emit('set-date', localDate)"		      
		    ></v-text-field>
		  </template>
		  <v-date-picker v-model="localDate" scrollable v-on:change="$emit('set-date', localDate)">
		    <div class="flex-grow-1"></div>
		    <v-btn text color="primary" @click="menu = false">(*)Cancel</v-btn>
		    <v-btn text color="primary" @click="$refs.datepicker.save(localDate)">(*)OK</v-btn>
		  </v-date-picker>
		</v-menu>

	</div>
</template>


<script>
export default {
	name: 'ottra-date-picker',
	props: {
		value: {
			default: '',
		},
		dateLabel: {
			default: '(*) Date',
			type: String,
		},
		dateHint: {
			default: '(*) Date',
			type: String,
		},
	},
	data: function() {
		return {
			menu: '',
		}
	},
	computed: {
		localDate: {
			get() { return this.value },
			set(localDate) { this.$emit('input', localDate) }
		}
	},
	mounted: function() {
		// This is just wrong. Why would I need to use nextTick?!
		this.$nextTick(() => {
			console.debug("%s: Setting date (%s)", __filename, this.date)
			this.localDate = this.date
		})
	},
}

</script>	