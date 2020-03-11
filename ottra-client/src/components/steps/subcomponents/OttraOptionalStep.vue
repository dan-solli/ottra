<template>
  <v-switch 
  	prepend-icon="mdi-apple-keyboard-option"
  	v-model="localValue" 
  	label="(*) Is this step optional?" 
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