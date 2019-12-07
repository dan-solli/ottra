<template>
	<v-row justify="center">
		<v-dialog 
			v-model="dialog" 
			:fullscreen="isFullScreen" 
			transition="dialog-bottom-transition">


<!--
			<template v-slot:activator="{ on }">
-->				
				<slot name="the_activator">
					<template v-slot:activator="{ on }">
						<v-btn v-on="on">(*) File browser </v-btn>
					</template>
				</slot>
<!--			
			</template>
-->			

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

							<v-btn-toggle dense group mandatory v-model="viewMode">
								<v-btn value="1"><v-icon>mdi-file-image</v-icon></v-btn>
								<v-btn value="0"><v-icon>mdi-view-list</v-icon></v-btn>
							</v-btn-toggle>

							<v-divider vertical class="mx-4"></v-divider>

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
					<v-row v-if="viewMode == 1">
						<v-col v-for="i in getDocuments" :key="i.uuid" class="d-flex child-flex">

							<v-card flat tile outlined 
								:id="i.uuid"
								@click="clickImage"
								v-bind:class="[isSelected(i.uuid) ? 'blue lighten-2' : '']">
								<v-card-text>
									<v-img v-if="isImage(i.mimetype)"
										:src="getProperURL(i.filename)"
										aspect-ratio="1"
										class="grey lighten-2">
										<template v-slot:placeholder>
											<v-row class="fill-height ma-0" align="center" justify="center">
												<v-progress-circular indeterminate color="grey lighten-5">
												</v-progress-circular>
											</v-row>
										</template>
									</v-img>
									<v-icon v-else x-large class="fill-height ma-0">
										{{ getIcon(i.mimetype) }}
									</v-icon>
								</v-card-text>
							</v-card>

					</v-col>


					</v-row>
					<v-row v-else-if="viewMode == 0">

						<v-col cols="12">
							<v-simple-table dense>
								<template v-slot:default>
									<thead>
										<tr>
											<th> (*) Filename </th>
											<th> (*) Filesize </th>
											<th> (*) Uploaded </th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="i in getDocuments" :key="i.uuid">
											<td> 
												<v-icon>{{ getIcon(i.mimetype) }}</v-icon> {{ i.original_filename }} 
											</td>
											<td> 0 </td>
											<td> {{ i.dateTime }} </td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
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
			viewMode: 0,
			search: '',
			currentFolder: '/',
			isFullScreen: false,
			dialog: false,
			mimeTypes: {
				'text/plain': 'mdi-file-document-box',
  			'application/msword': 'mdi-file-word',
  			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'mdi-file-word',
  			'application/pdf': 'mdi-file-pdf',
  			'image/jpeg': 'mdi-image',
  			'image/tiff': 'mdi-image',
  			'image/gif': 'mdi-image',
  			'image/png': 'mdi-image',

/*
				'blah': 'mdi-file-excel',
				'blah': 'mdi-file-powerpoint',
*/				
			}			
		}
	},
	computed: {
		...mapGetters([ 
			"getDocuments",
			"getSelectedFiles",
			"getUserID"
		])
	},
  mounted() {
    this.$store.dispatch("loadDocuments")
  },
  methods: {
		isImage: function(item) {
			if (!item) {
				return false
			} else {
				return [ 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml' ].includes(item)
			}
		},
		getIcon: function(item) {
			if (this.mimeTypes.hasOwnProperty(item)) {
				return this.mimeTypes[item]
			} else {
				return 'mdi-help-box'
			}
		},
		getProperURL: function(url) {
			if (url.substring(0,5) === 'blob:') {
				return url
			} else {
				// TODO: Must replace this URL. Yikes.
				return `https://192.168.1.200:8888/content/${this.getUserID}/${url}`
			}
		},
		clickImage: function(event) {
			const imageUUID = event.currentTarget.id

			if (this.isSelected(imageUUID)) {
    		this.$store.dispatch("removeSelectedFile", imageUUID)				
			} else {
    		this.$store.dispatch("addSelectedFile", imageUUID)				
			}
		},
		isSelected: function(uuid) {
			return this.getSelectedFiles.includes(uuid)
		}
  }	
}	
</script>
