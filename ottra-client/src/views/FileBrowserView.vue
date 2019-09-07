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

<!--

<template>
	<div class="file-browser-view">
		<v-toolbar class="mt-5" dense>
			<v-toolbar-title> {{ $t('ui.view.filebrowser.heading') }} </v-toolbar-title>

			<div class="flex-grow-1"></div>
				<v-toolbar-items>
					<OttraFileUploadDialog></OttraFileUploadDialog>
					<v-divider class="mx-4" vertical></v-divider>
					<v-text-field v-model="search" solo flat 
							:label="$t('ui.text.search')" hide-details prepend-inner-icon="mdi-magnify"
							clearable clear-icon="mdi-close-circle-outline">
					</v-text-field>
			</v-toolbar-items>
		</v-toolbar>

		<v-container>
			<v-row>
				<v-col cols="12">
					<v-card> 				
						<v-container fluid>
							<v-row>
								<v-col v-for="i in getDocuments" :key="i.uuid" class="d-flex child-flex" cols="2">
									<OttraImageOrIcon :doc="i"></OttraImageOrIcon>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

-->

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
    this.$store.dispatch("loadDocuments")
  }	
}	
</script>

