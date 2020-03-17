<template>
	<v-btn icon @click.native.stop="">
		<v-icon v-if="localValue" color="green"> 
			mdi-checkbox-marked-circle-outline
		</v-icon>
		<v-icon v-else color="orange">
			mdi-alert-circle
		</v-icon>
	</v-btn>
</template>

<script>

export default {
	name: 'ottra-step-state',
	props: [ 'value' ],
	methods: {
		saveState() {
		}
	},
	computed: {
		localValue: {
			get() { this.value },
			set(localValue) { this.$emit('input', localValue) }
		}
	}
}

</script>	