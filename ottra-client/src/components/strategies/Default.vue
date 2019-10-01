<template>
	<v-btn-toggle v-model="priority" mandatory>
		<v-btn> 0 </v-btn>
		<v-btn class="red lighten-1"> ! </v-btn>
		<v-btn class="red darken-2"> !! </v-btn>
		<v-btn class="red darken-4"> !!! </v-btn>
	</v-btn-toggle>
</template>

<script>
export default {
	name: 'ottra-priority-strategy-default',
	data: function() {
		return {
			priority: 0,
		}
	}
}
</script>