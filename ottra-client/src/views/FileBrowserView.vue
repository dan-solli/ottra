<template>
	<div class="file-browser-view">
		<v-toolbar class="mt-5" dense>
			<v-toolbar-title> (*)File Browser </v-toolbar-title>

			<div class="flex-grow-1"></div>
			<v-toolbar-items>
				<v-btn text>
					<v-icon>mdi-upload</v-icon>
					(*) Upload
				</v-btn>
				<v-text-field v-model="search" solo flat 
						label="(*) Search..." hide-details prepend-inner-icon="mdi-magnify"
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
								<v-col v-for="n in 18" :key="n" class="d-flex child-flex" cols="2">
									<v-card flat tile class="d-flex">
		               <v-img
		                  :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
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
							</v-row>
						</v-container>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	name: 'file-browser-view',
	data: function() {
		return {
			search: '',
		}
	}
}	
</script>