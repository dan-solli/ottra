<template>
	<v-card flat tile outlined>
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


		<v-card-actions>

			<v-btn fab dark small class="blue lighten-4">
				<v-icon>mdi-pencil</v-icon>
			</v-btn>

			<v-btn fab dark small class="indigo lighten-4">
				<v-icon>mdi-information</v-icon>
			</v-btn>

			<v-spacer></v-spacer>

			<v-btn fab dark small color="red">
				<v-icon>mdi-trash-can</v-icon>
			</v-btn>

		</v-card-actions>
	</v-card>
</template>

<!-- 			:src="`https://192.168.1.200:8888/content/${getUserID}/${doc.filename}`"
-->

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'ottra-image-or-icon',
	props: {
		doc: Object
	},
	data: function() {
		return {
			fab: false,
			mimeTypes: {
				'text/plain': 'mdi-file-document-box',
  			'application/msword': 'mdi-file-word',
  			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'mdi-file-word',
  			'application/pdf': 'mdi-file-pdf',
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
				return `https://192.168.1.200:8888/content/${this.getUserID}/${url}`
			}
		}
	},
	computed: {
		...mapGetters([
			"getUserID"
		])
	}
}
</script>