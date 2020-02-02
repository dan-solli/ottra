<template>
	<v-dialog 
		v-model="dialog" 
		:fullscreen="isFullScreen" 
		transition="dialog-bottom-transition">

		<template v-slot:activator="{ on: dialog }">
			<v-btn icon v-on="dialog">
				<v-icon>mdi-attachment</v-icon>
			</v-btn>
		</template>


		<v-card>
			<v-card-title>
				<v-toolbar dense>
					<v-btn icon @click="dialog = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
					<v-toolbar-title>
						<!-- 	{{ $t('ui.view.filebrowser.heading') }} -->
						{{ getCWD }}
					</v-toolbar-title>


					<div class="flex-grow-1"></div>

					<v-toolbar-items>

						<v-btn icon @click="upOneDirectory">
							<v-icon>mdi-subdirectory-arrow-left</v-icon>
						</v-btn>
						<OttraNewFolderDialog></OttraNewFolderDialog>
						
						<OttraFileUploadDialog></OttraFileUploadDialog>

						<v-divider class="mx-4" vertical></v-divider>

						<OttraFolderBrowser></OttraFolderBrowser>
<!--
						<v-btn 
							:disabled="!hasSelectedFiles" 
							@click="moveFiles"
							text>
							<v-icon>mdi-file-move</v-icon>
						</v-btn>
-->

						<v-btn 
							:disabled="!hasSelectedFiles"
							@click="deleteFiles"
							text>
							<v-icon>mdi-trash-can</v-icon>
						</v-btn>

						<v-divider class="mx-4" vertical></v-divider>

						<v-btn-toggle dense group mandatory v-model="viewMode">
							<v-btn value="1"><v-icon>mdi-file-image</v-icon></v-btn>
							<v-btn value="0"><v-icon>mdi-view-list</v-icon></v-btn>
						</v-btn-toggle>

						<v-divider class="mx-4" vertical></v-divider>

						<v-select 
							v-model="sortOrder"
							:items="sortOrderItems"
							placeholder="(*) Sort" 
							dense></v-select>


						<v-divider vertical class="mx-4"></v-divider>


						<v-text-field v-model="searchFilter" solo flat 
								:label="$t('ui.text.search')" hide-details prepend-inner-icon="mdi-magnify"
								clearable 
								@click:clear="resetFilter"
								clear-icon="mdi-close-circle-outline">
						</v-text-field>

						<v-divider class="mx-0" vertical></v-divider>

						<v-btn text @click="isFullScreen = !isFullScreen">
							<v-icon v-if="isFullScreen">mdi-window-restore</v-icon>
							<v-icon v-else>mdi-window-maximize</v-icon>
						</v-btn>


					</v-toolbar-items>
				</v-toolbar>
			</v-card-title>


			<v-container fluid>

				<v-row v-if="viewMode == 1">
					<v-col cols="2" v-for="i in getSortedDocuments" :key="i.uuid" class="d-flex child-flex">

						<v-card flat tile outlined 
							:id="i.uuid"
							@click="clickImage(i, $event)"
							v-bind:class="[isSelected(i.uuid) ? 'blue lighten-2' : '']">
							<v-card-text>
								<v-img v-if="isImage(i.mimetype)"
									:src="getProperURL(i)"
									aspect-ratio="1"
									class="grey lighten-2">
									<template v-slot:placeholder>
										<v-row class="fill-height ma-0" align="center" justify="center">
											<v-progress-circular indeterminate color="grey lighten-5">
											</v-progress-circular>
										</v-row>
									</template>
								</v-img>
								<div v-else>
									<v-icon x-large class="fill-height ma-0">
										{{ getIcon(i) }}
									</v-icon>
									{{ i.name }}
								</div>
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
									<tr v-for="i in getSortedDocuments" :key="i.uuid">
										<td> 
											<v-icon>{{ getIcon(i) }}</v-icon> 
											{{ i.type === "directory" ? i.name : i.original_filename }} 
										</td>
										<td> {{ i.size | humanize }} </td>
										<td> {{ i.dateTime }} </td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-col>
				</v-row>

				<v-row v-if="attachDocument">
					<v-btn text @click="$emit('attach-documents'); dialog = false">
						(*) Attach
					</v-btn>
				</v-row>

			</v-container>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import OttraFileUploadDialog from '@/components/documentmanager/OttraFileUploadButtonAndDialog.vue'
import OttraImageOrIcon from '@/components/documentmanager/OttraImageOrIcon.vue'
import OttraNormalView from '@/components/layout/normalView.vue'
import OttraNewFolderDialog from '@/components/documentmanager/OttraNewFolderDialog.vue'
import OttraFolderBrowser from '@/components/documentmanager/OttraFolderBrowser.vue'

export default {
	name: 'file-browser-view',
	props: {
		attachDocument: {
			type: Boolean,
			default: true
		},
		documents: {
			type: Array,
			default: []
		}
	},
  components: {
    OttraFileUploadDialog,
    OttraImageOrIcon,
    OttraNormalView,
    OttraNewFolderDialog,
    OttraFolderBrowser
  },
	data: function() {
		return {
			viewMode: 0,
			searchFilter: '',
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
				'blah': 'mdi-file-excel',
				'blah': 'mdi-file-powerpoint',
			},
			sortOrder: 3,
			sortOrderItems: [
				{ text: "(*) A-Z", value: 1 },
				{ text: "(*) Z-A", value: 2 },
				{ text: "(*) Recent first", value: 3 },
				{ text: "(*) Oldest first", value: 4 },
				{ text: "(*) Biggest first", value: 5 },
				{ text: "(*) Smallest first", value: 6 },
			],
		}
	},
	filters: {
		humanize: function(val) {
  		if (val > 1024 * 1024) {
  			return parseFloat(val / (1024 * 1024)).toFixed(2) + " Mb"
  		} else if (val > 1024) {
  			return parseFloat(val / 1024).toFixed(2) + " kb"
  		} else {
  			return parseFloat(val).toFixed(2)
  		}
  	},
	},
	computed: {
		...mapGetters([ 
			"getDocuments",
			"getSelectedFiles",
			"getUserID",
			"getCWD"
		]),
		hasSelectedFiles: function() {
			return Object.keys(this.getSelectedFiles).length
		},
		getSortedDocuments: function() {
			console.debug("%s: searchFilter is ->%s<-", __filename, this.searchFilter)
			var docList = Object.values(this.getDocuments)

			if (this.sortOrder == 1 || this.sortOrder == 2) {
				docList.sort(function(a, b) {
					return a.original_filename > b.original_filename ? 1 : 
								 a.original_filename < b.original_filename ? -1 : 0
				})
			}
			else if (this.sortOrder == 3 || this.sortOrder == 4) {
				docList.sort(function(a, b) {
					return a.created > b.created ? 1 : 
								 a.created < b.created ? -1 : 0
				})
			}
			else if (this.sortOrder == 5 || this.sortOrder == 6) {
				docList.sort(function(a, b) {
					return a.size > b.size ? -1 : 
								 a.size < b.size ? 1 : 0
				})
			}
			else {
				this.sortOrder = 1
				return this.getSortedDocuments
			}
			if (this.searchFilter != '' && this.searchFilter != null) {
				docList = docList.filter(function(file) {
					return (file.original_filename.includes(this.searchFilter) ? file : 0)
				}, this)
			}
			return ((this.sortOrder % 2) == 0) ? docList.reverse() : docList;
		}
	},
  mounted() {
    this.$store.dispatch("loadDocuments")
    this.$store.dispatch("getFolderTree")
  },
  methods: {
  	resetFilter: function() {
  		this.searchFilter = ''
  	},
		isImage: function(item) {
			if (!item) {
				return false
			} else {
				return [ 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml' ].includes(item)
			}
		},
		getIcon: function(item) {
			if (this.mimeTypes.hasOwnProperty(item.mimetype)) {
				return this.mimeTypes[item.mimetype]
			} 
			else if (item.type === 'directory') {
				return 'mdi-folder-outline'
			} else {
				return 'mdi-help-box'
			}
		},
		getProperURL: function(doc) {
			if (doc.filename.substring(0,5) === 'blob:') {
				return doc.filename
			} else {
				// TODO: Must replace this URL. Yikes.
				// This should soak up the cwd. How?
				return `https://192.168.1.200:8888/content/${this.getUserID}/${doc.path}/${doc.filename}`
			}
		},
		clickImage: function(doc) {
			console.debug(doc)

			if (doc.type === 'directory') {
				this.$store.dispatch("changeDir", doc.path + "/" + doc.name)
			} else {
				const imageUUID = doc.uuid

				if (this.isSelected(imageUUID)) {
	    		this.$store.dispatch("removeSelectedFile", imageUUID)				
				} else {
	    		this.$store.dispatch("addSelectedFile", imageUUID)				
				}
			}
		},
		upOneDirectory: function() {
			this.$store.dispatch("changeDir", "..")
		},
		isSelected: function(uuid) {
			return this.getSelectedFiles.includes(uuid)
		},
		deleteFiles: function() {
			this.$store.dispatch("deleteFiles", this.getSelectedFiles)
		},
		moveFiles: function() {
			this.$store.dispatch("moveFiles", { 
				files: this.getSelectedFiles, 
				target: null
			})
		}
  }	
}	
</script>
