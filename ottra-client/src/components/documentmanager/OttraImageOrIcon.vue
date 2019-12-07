<template>
	<div>
		<v-card flat tile outlined 
			v-if="viewMode == VIEWMODE_THUMBNAILS"
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

import { mapGetters, mapActions } from 'vuex'
import { VIEWMODE_THUMBNAILS, VIEWMODE_DETAILS } from '@/common/filebrowser.types'

export default {
	name: 'ottra-image-or-icon',
	props: {
		doc: Object,
		readOnly: Boolean,
		showFilename: Boolean,
		pickable: Boolean,
		viewMode: Number,
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