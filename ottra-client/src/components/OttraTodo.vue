<template>
	<div class="ottra-todo">

		<v-card v-if="viewMode === 'card'" flat tile outlined>
			<v-card-title> 
				{{ todo.subject }} 
			</v-card-title>
			<v-card-text> {{ todo.body }} </v-card-text>
			<v-card-actions>
				<OttraTodoButtons :todo="todo"></OttraTodoButtons>
			</v-card-actions>
		</v-card>

	</div>
</template>

<script>

import OttraTodoButtons from '@/components/OttraTodoButtons'

export default {
	name: 'ottra-todo',
	components: {
		OttraTodoButtons,
	},
	props: {
		viewMode: String,
		todo: Object
	},
	data: function() {
		return {
			localFab: {},
		}
	}
}
</script>