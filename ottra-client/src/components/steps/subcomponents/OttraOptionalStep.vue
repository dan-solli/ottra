<template>
  <v-switch 
  	prepend-icon="mdi-apple-keyboard-option"
  	v-model="localValue" 
  	:label="$t('ui.component.step.optionalsteplabel')" 
  	required>
  </v-switch>
</template>

<script>
export default {
	name: 'ottra-optional-step',
	props: ['value'],
	computed: {
		localValue: {
			get() { return this.value },
			set(localValue) { this.$emit('input', localValue) }
		}
	}
}	
</script>