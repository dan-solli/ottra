<template>
	<v-card flat tile class="d-flex align-center justify-center" outlined>
		<v-img v-if="isImage(doc.mimetype)"
			:src="`https://192.168.1.200:8888/content/${getUserID}/${doc.filename}`"
			aspect-ratio="1"
			class="grey lighten-2">
			<template v-slot:placeholder>
				<v-row class="fill-height ma-0" align="center" justify="center">
					<v-progress-circular indeterminate color="grey lighten-5">
					</v-progress-circular>
				</v-row>
			</template>
		</v-img>
		<v-icon v-else x-large>
			{{ getIcon(doc.mimetype) }}
		</v-icon>
	</v-card>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'ottra-image-or-icon',
	props: {
		doc: Object
	},
	data: function() {
		return {
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
		}
	},
	computed: {
		...mapGetters([
			"getUserID"
		])
	}
}
</script>