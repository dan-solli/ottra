import { mapGetters } from 'vuex'

export const DocumentMixin = {
	computed: {
		...mapGetters([
			"findFileByUUID"
		])
	},
	methods: {
		attachmentUUIDToFilename: function(attachment_arr = []) {
			if (attachment_arr.length < 1) {
				return ""
			} else {
				return attachment_arr.map(function(f) {
					return this.findFileByUUID(f).original_filename
				}, this).join(", ")
			}
			return ""
		}
	},
}