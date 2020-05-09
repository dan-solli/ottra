<template>
	<div>
		<v-card flat tile outlined 
			v-if="viewMode == getOC('VIEWMODE/THUMB')"
			:id="doc.uuid"
			@click="clickImage"
			v-bind:class="[selected ? 'blue lighten-2' : '']">
			<v-card-text>
				<v-img v-if="isImage(doc.mimetype)"
					:src="getProperURL(doc.filename)"
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
					{{ getIcon(doc.mimetype) }}
				</v-icon>
			</v-card-text>

			<v-card-actions v-if="viewActionButtons">
			</v-card-actions>
		</v-card>

		<div v-else>
			<td> <v-icon>{{ getIcon(doc.mimetype) }}</v-icon> {{ doc.original_filename }} </td>
			<td> 0 </td>
			<td> {{ doc.dateTime }} </td>
		</div>
	</div>
</template>

<script>

import { mapGetters } from 'vuex'
//import { ViewModes } from '@/common/filebrowser.types'

export default {
	name: 'ottra-image-or-icon',
	props: {
		doc: Object,
		readOnly: Boolean,
		showFilename: Boolean,
		pickable: Boolean,
		viewMode: {
			type: Number,
			default: 1
		}
	},
	data: function() {
		return {
			selected: false,
			fab: false,
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
			} 
			else if (item.type === 'directory') {
				return 'mdi-folder-outline'
			}
			else {
				return 'mdi-help-box'
			}
		},
		getProperURL: function(url) {
			console.debug("%s: getProperURL called with %s", __filename, url)
			if (url.substring(0,5) === 'blob:') {
				console.debug("%s: getProperURL returns: %s", __filename, url)
				return url
			} else {
				console.debug("%s: getProperURL returns: %s", __filename, 
					`${this.getServerPath}/${this.getUserID}/${url}`)
				return `${this.getServerPath}/${this.getUserID}/${url}`
			}
		},
		clickImage: function(event) {
			const imageUUID = event.currentTarget.id

			this.selected = !this.selected

			if (this.selected) {
    		this.$store.dispatch("addSelectedFile", imageUUID)				
			} else {
    		this.$store.dispatch("removeSelectedFile", imageUUID)				
			}
		},
	},
	computed: {
		...mapGetters([
			"getUserID",
			"getSelectedFiles",
			"getServerPath",
			"getOC"
		]),
		viewActionButtons: function() {
			return !this.readOnly
		},
		viewFilename: function() {
			return this.showFilename
		},
		viewSelectOption: function() {
			return this.readOnly
		},
		isPickable: function() {
			return this.pickable
		}
	}
}
</script>