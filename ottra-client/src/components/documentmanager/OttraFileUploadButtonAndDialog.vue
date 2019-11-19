<template>
	<v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
				<v-icon>mdi-upload</v-icon>
				{{ $t('ui.view.filebrowser.uploadbutton') }}
			</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline"> {{ $t('ui.dialog.uploadfiles.heading') }} </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-file-input v-model="files" chips multiple :label="$t('ui.text.uploadfile')">
               </v-file-input>
             </v-col>
          </v-row>
          <v-row>
          	<v-col cols="12" align="center" justify="center">
          		<v-carousel v-if="previewFiles.length > 1">
          			<v-carousel-item v-for="(item, i) in previewFiles" :key="i"
                  reverse-transition="fade-transition" 
                  transition="fade-transition">
                  <OttraImageOrIcon :doc="item"></OttraImageOrIcon>
          			</v-carousel-item>
          		</v-carousel>
          		<v-img height="500" v-else-if="previewFiles.length === 1" :src="previewFiles[0]"></v-img>
          	</v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn text @click="dialog = false">
        	{{ $t('ui.text.cancel') }}
        </v-btn>
        <v-btn text @click="uploadDocument">
        	{{ $t('ui.text.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>	
</template>

<script>

import OttraImageOrIcon from '@/components/documentmanager/OttraImageOrIcon.vue'


export default {
	name: 'ottra-file-upload-dialog',
  components: {
    OttraImageOrIcon
  },  
	data: function() {
		return {
			dialog: false,
			files: [],
		}
	},
	methods: {
		uploadDocument: function() {
    	this.$store.dispatch("uploadDocuments", this.files)
    	this.dialog = false
    	this.files = []
		}
	},
	computed: {
		previewFiles: function() {
			return this.files.map(function(f) {
				return { mimetype: f.type, filename: window.URL.createObjectURL(f) }
			}) || []
		}
	}
}
</script>		    