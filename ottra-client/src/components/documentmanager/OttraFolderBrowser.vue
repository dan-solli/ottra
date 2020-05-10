<template>
	<v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">


<!-- :disabled="!hasSelectedFiles" --> 
      <v-btn v-on="on" text>
        <v-icon>mdi-file-move</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline"> {{ $t('ui.dialog.folderbrowser.folders') }}  </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-treeview dense open-all 
                activatable
                :items="[ getFolderTree ]" 
                item-key="path"
                item-text="name"
                @update:active="markedFolder"></v-treeview>
             </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn text @click="dialog = false">
        	{{ $t('ui.text.cancel') }}
        </v-btn>
        <v-btn text @click="moveToFolder">
        	{{ $t('ui.text.checkdone') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>	
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'ottra-folder-browser',
	data: function() {
		return {
      selectedFolder: '',
      dialog: false,
		}
	},
  computed: {
    ...mapGetters([ 
      "getFolderTree",
    ])
  },
  methods: {
    moveToFolder: async function() {

    },
    markedFolder: function(event) {
      this.selectedFolder = event
    }
  }
}
</script>		    