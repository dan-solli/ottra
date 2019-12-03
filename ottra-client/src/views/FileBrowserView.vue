<template>
	<OttraNormalView>
		<template v-slot:toolbar-title> 
			{{ $t('ui.view.filebrowser.heading') }}
		</template>
		<template v-slot:toolbar-leftside>
			<OttraFileUploadDialog></OttraFileUploadDialog>
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
					<v-col v-for="i in getDocuments" :key="i.uuid" class="d-flex child-flex" cols="2">
						<OttraImageOrIcon :doc="i"></OttraImageOrIcon>
					</v-col>
				</v-row>
			</v-container>
		</template>			
	</OttraNormalView>
</template>

<script>

import { mapGetters } from 'vuex'

import OttraFileUploadDialog from '@/components/documentmanager/OttraFileUploadButtonAndDialog.vue'
import OttraImageOrIcon from '@/components/documentmanager/OttraImageOrIcon.vue'
import OttraNormalView from '@/components/layout/normalView.vue'

export default {
	name: 'file-browser-view',
  components: {
    OttraFileUploadDialog,
    OttraImageOrIcon,
    OttraNormalView
  },
	data: function() {
		return {
			search: '',
		}
	},
	computed: {
		...mapGetters([ 
			"getDocuments",
		])
	},
  mounted() {
  	console.error("%s: This component is deprecated. Kill it with fire!", __filename)
    this.$store.dispatch("loadDocuments")
  }	
}	
</script>

