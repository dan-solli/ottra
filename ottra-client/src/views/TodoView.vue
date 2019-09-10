<template>
	<OttraNormalView>
		<template v-slot:toolbar-title> 
			{{ $t('ui.view.todo.heading') }}
		</template>
		<template v-slot:toolbar-rightside>
			<v-text-field v-model="search" solo flat 
					:label="$t('ui.text.search')" hide-details prepend-inner-icon="mdi-magnify"
					clearable clear-icon="mdi-close-circle-outline">
			</v-text-field>
		</template>			

		<template v-slot:main-content>
			<v-container fluid>
				<v-row>
					<v-col v-for="i in getTodos" :key="i.uuid" class="d-flex child-flex" cols="2">
						<OttraTodo :todo="i" view-mode="card"></OttraTodo>
					</v-col>
				</v-row>
			</v-container>
		</template>			
	</OttraNormalView>
</template>

<script>

import { mapGetters } from 'vuex'

import OttraNormalView from '@/components/layout/normalView.vue'
import OttraTodo from '@/components/OttraTodo.vue'

export default {
	name: 'ottra-todo-view',
  components: {
    OttraNormalView,
    OttraTodo
  },
	data: function() {
		return {
			search: '',
		}
	},
	computed: {
		...mapGetters([ 
			"getTodos",
		])
	},
  mounted() {
    this.$store.dispatch("loadTodos")
  }	
}	
</script>

