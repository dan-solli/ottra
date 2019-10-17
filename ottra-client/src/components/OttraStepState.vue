<template>
	<v-btn icon>
		<v-icon v-if="stepState" color="green"> 
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
	props: [ 'stepState'],
	data: function() {
		return {
		}
	},
	methods: {
		saveState() {

		}
	}
}

</script>	