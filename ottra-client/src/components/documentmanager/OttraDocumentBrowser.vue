<template>
	<v-row justify="center">
		<v-dialog 
			v-model="dialog" 
			:fullscreen="isFullScreen" 
			transition="dialog-bottom-transition">
			<template v-slot:activator="{ on }">
				<v-btn color="primary" dark v-on="on">(*) File browser </v-btn>
			</template>

			<v-card>
				<v-card-title>
					<v-toolbar dense>
						<v-btn icon @click="dialog = false">
							<v-icon>mdi-close</v-icon>
						</v-btn>
						<v-toolbar-title>
							{{ $t('ui.view.filebrowser.heading') }}
						</v-toolbar-title>


						<div class="flex-grow-1"></div>

						<v-toolbar-items>
							<OttraNewFolderDialog :cwd="currentFolder"></OttraNewFolderDialog>
							<OttraFileUploadDialog></OttraFileUploadDialog>

							<v-btn text @click="isFullScreen = !isFullScreen">
								<v-icon v-if="isFullScreen">mdi-window-restore</v-icon>
								<v-icon v-else>mdi-window-maximize</v-icon>
							</v-btn>

							<v-divider class="mx-4" vertical></v-divider>

							<v-text-field v-model="search" solo flat 
									:label="$t('ui.text.search')" hide-details prepend-inner-icon="mdi-magnify"
									clearable clear-icon="mdi-close-circle-outline">
							</v-text-field>
						</v-toolbar-items>
					</v-toolbar>
				</v-card-title>

				<v-container fluid>
					<v-row>
						<v-col v-for="i in getDocuments" :key="i.uuid" class="d-flex child-flex" cols="2">
							<OttraImageOrIcon :doc="i"></OttraImageOrIcon>
						</v-col>
					</v-row>
				</v-container>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import OttraFileUploadDialog from '@/components/documentmanager/OttraFileUploadButtonAndDialog.vue'
import OttraImageOrIcon from '@/components/documentmanager/OttraImageOrIcon.vue'
import OttraNormalView from '@/components/layout/normalView.vue'
import OttraNewFolderDialog from '@/components/documentmanager/OttraNewFolderDialog.vue'

export default {
	name: 'file-browser-view',
  components: {
    OttraFileUploadDialog,
    OttraImageOrIcon,
    OttraNormalView,
    OttraNewFolderDialog
  },
	data: function() {
		return {
			search: '',
			currentFolder: '/',
			isFullScreen: false,
			dialog: false,
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
