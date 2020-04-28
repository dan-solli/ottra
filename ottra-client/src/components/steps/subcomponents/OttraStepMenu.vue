<template>
	<v-menu offset-y>
		<template v-slot:activator="{ on }">
			<v-btn icon @click.native.stop="" v-on="on">
				<v-icon>mdi-menu</v-icon>
			</v-btn>
		</template>
		<v-list>
			<v-list-item @click="$emit('edit-step')">
	      <v-list-item-icon>
	        <v-icon>mdi-pencil</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) Edit step</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="$emit('move-up')">
	      <v-list-item-icon>
	        <v-icon>mdi-arrow-up-bold</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) Move up</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="$emit('move-down')">
	      <v-list-item-icon>
	        <v-icon>>mdi-arrow-down-bold</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) Move down</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="$emit('remove-step')">
	      <v-list-item-icon>
	        <v-icon>mdi-delete</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) Remove step</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
export default {	
	name: 'ottra-step-menu'
	// Methods here, talk directly to vuex? OR? We just got the step, but not the task. 
}

</script>
