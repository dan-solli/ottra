<template>
	<v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
				<v-icon>mdi-folder-plus-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline"> (*) New folder </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="folderName" label="New folder name"></v-text-field>
             </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn text @click="dialog = false">
        	{{ $t('ui.text.cancel') }}
        </v-btn>
        <v-btn text @click="createFolder">
        	{{ $t('ui.text.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>	
</template>

<script>

import OttraImageOrIcon from '@/components/documentmanager/OttraImageOrIcon.vue'


export default {
	name: 'ottra-new-folder-dialog',
  props: [ 'cwd' ],
	data: function() {
		return {
			dialog: false,
			folderName: '',
		}
	},
	methods: {
		createFolder: function() {
      const payload = {
        cwd: this.cwd,
        folderName: this.folderName
      }
    	this.$store.dispatch("createFolder", payload)
    	this.dialog = false
    	this.folderName = ''
		}
	}
}
</script>		    