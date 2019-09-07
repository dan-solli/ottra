<template>
	<v-container>
		<v-row>
			<v-col class="card">
				<OttraImageOrIcon 
					pickable
					show-filename
					v-for="i in getDocuments" 
					:key="i.uuid" 
					class="card--content" 
					:doc="i">
				</OttraImageOrIcon>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>

import { mapGetters } from 'vuex'
import OttraImageOrIcon from '@/components/documentmanager/OttraImageOrIcon.vue'

export default {
	name: 'ottra-horiz-document-picker',
	components: {
		OttraImageOrIcon,
	},
	computed: {
		...mapGetters([
			"getDocuments"
		])
	}
}
</script>

<style scoped>
.card {
	display: flex;
	background-color: #fff;
	min-width: 100%;
	min-height: 200px;
	overflow-x: auto;
}

.card--content {
	background-color: #e74c3c;
	min-width: 200px;
	margin: 5px;
}
</style>