<template>
	<v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
				<v-icon>mdi-folder-plus-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline"> {{ $t('ui.dialog.documentbrowser.newfolder') }} </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field 
                v-model="folderName" 
                :label="$t('ui.dialog.documentbrowser.newfolderlabel')"></v-text-field>
             </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn 
          v-shortkey.push="['esc']"
          @shortkey="dialog = false"
          text 
          @click="dialog = false">
        	{{ $t('ui.text.cancel') }}
        </v-btn>
        <v-btn 
          text 
          v-shortkey.push="['enter']"
          @shortkey="createFolder"
          @click="createFolder">
        	{{ $t('ui.text.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>	
</template>

<script>

import { mapGetters } from 'vuex'

import OttraImageOrIcon from '@/components/documentmanager/OttraImageOrIcon.vue'


export default {
	name: 'ottra-new-folder-dialog',
	data: function() {
		return {
			dialog: false,
			folderName: '',
		}
	},
  computed: {
    ...mapGetters([
      "getCWD"
    ])
  },
	methods: {
		createFolder: function() {
    	this.$store.dispatch("createFolder", this.folderName)
    	this.dialog = false
    	this.folderName = ''
		}
	}
}
</script>		    