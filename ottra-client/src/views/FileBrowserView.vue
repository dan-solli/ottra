<template>
	<div class="file-browser-view">
		<v-toolbar class="mt-5" dense>
			<v-toolbar-title> {{ $t('ui.view.filebrowser.heading') }} </v-toolbar-title>

			<div class="flex-grow-1"></div>
			<v-toolbar-items>

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
		                <v-file-input 
		                  v-model="files"
		                  chips multiple
		                  :label="$t('ui.text.uploadfile')" 
		                  v-on:change="printFileObjects">
		                 </v-file-input>
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

				<v-text-field v-model="search" solo flat 
						:label="$t('ui.text.search')" hide-details prepend-inner-icon="mdi-magnify"
						clearable clear-icon="mdi-close-circle-outline">
				</v-text-field>
			</v-toolbar-items>
		</v-toolbar>

		<v-container>
			<v-row>
				<v-col cols="12">
					<v-card> 				
						<v-container fluid>
							<v-row>
								<v-col v-for="i in getDocuments" :key="i.uuid" class="d-flex child-flex" cols="2">
									<v-card flat tile class="d-flex">
										<v-img 
											:src="`http://192.168.1.200:8081/content/${getUserID}/${i.uuid}`"
											aspect-ratio="1"
											class="grey lighten-2">
											<template v-slot:placeholder>
												<v-row class="fill-height ma-0" align="center" justify="center">
													<v-progress-circular indeterminate color="grey lighten-5">
													</v-progress-circular>
												</v-row>
											</template>
										</v-img>
									</v-card>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'file-browser-view',
	data: function() {
		return {
			dialog: false,
			search: '',
			files: [],
		}
	},
	computed: {
		...mapGetters([ 
			"getDocuments",
			"getUserID"
		])
	},
	methods: {
		printFileObjects: function(data) {
      console.log("%s: printFileObjects data: %O", __filename, data)
    },
    uploadDocument: function() {
    	console.debug("%s: In uploadDocument, calling with %s", __filename, [ this.files ])
    	this.$store.dispatch("uploadDocuments", this.files)
    	this.dialog = false
    }
	}
}	
</script>

<!--								
								<v-col v-for="n in 18" :key="n" class="d-flex child-flex" cols="2">
									<v-card flat tile class="d-flex">
		               <v-img
		                  :src="`http://picsum.photos/500/300?image=${n * 5 + 10}`"
		                  :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
		                  aspect-ratio="1"
		                  class="grey lighten-2"
		                >
		                  <template v-slot:placeholder>
		                    <v-row
		                      class="fill-height ma-0"
		                      align="center"
		                      justify="center"
		                    >
		                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
		                    </v-row>
		                  </template>
		                </v-img>
									</v-card>
								</v-col>										
-->