<template>
  <v-switch 
  	prepend-icon="mdi-apple-keyboard-option"
  	v-model="value" 
  	label="(*) Is this step optional?" 
  	required>
  </v-switch>
</template>

<script>
export default {
	name: 'ottra-optional-step',
	props: ['value'],
}	
</script>