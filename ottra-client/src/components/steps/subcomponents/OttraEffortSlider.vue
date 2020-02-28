<template>
  <v-slider
	  v-model="localValue"
	  prepend-icon="mdi-flash"
	  append-icon="mdi-iframe-variable-outline" 
	  :tick-labels="tickLabels"
	  max="4"
	  step="1"
	  :thumb-color="getThumbColor(value)"
	  :track-fill-color="getThumbColor(value)"
	  ticks="always"
		tick-size="4">
	</v-slider>
</template>

<script>

import { OttraEffortMixin } from '@/components/steps/mixins/OttraEffortMixin'

export default {	
	name: 'ottra-effort-slider',
	mixins: [ OttraEffortMixin ],
	props: [ 'value' ],
	computed: {
		localValue: {
			get() { return this.value },
			set(localValue) { this.$emit('input', localValue) }
		}
	}
}

</script>	