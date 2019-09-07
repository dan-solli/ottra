<template>
	<div>
		<v-toolbar class="mt-5" dense>
			<v-toolbar-title>
				<slot name="toolbar-title"></slot>
			</v-toolbar-title>

			<div class="flex-grow-1"></div>

			<v-toolbar-items>
				<slot name="toolbar-leftside"></slot>

				<v-divider class="mx-4" vertical></v-divider>

				<slot name="toolbar-rightside"></slot>
			</v-toolbar-items>
		</v-toolbar>

		<v-container>
			<v-row>
				<v-col cols="12">
					<v-card> 				
						<slot name="main-content"></slot>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>			
</template>

<script>

export default { 
	name: 'ottra-normal-view'
}
