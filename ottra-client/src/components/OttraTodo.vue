<template>
	<div class="ottra-todo">

		<v-card v-if="viewMode === 'card'" flat tile outlined>
			<v-card-title> {{ todo.subject }} </v-card-title>
			<v-card-text> {{ todo.body }} </v-card-text>
			<v-card-actions>
				<v-btn small> (*) Complete </v-btn>
				<v-btn small> (*) Delete </v-btn>
			</v-card-actions>
		</v-card>

	</div>
</template>

<script>
export default {
	name: 'ottra-todo',
	props: {
		viewMode: String,
		todo: Object
	}
}
</script>