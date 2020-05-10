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
					<v-list-item-title> 
						{{ $t('ui.component.step.menu.editstep') }} 
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item :disabled="step_position === 0" @click="$emit('move-up')">
	      <v-list-item-icon>
	        <v-icon>mdi-arrow-up-bold</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>
						{{ $t('ui.component.step.menu.moveup') }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="$emit('move-down')">
	      <v-list-item-icon>
	        <v-icon>>mdi-arrow-down-bold</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>
						{{ $t('ui.component.step.menu.movedown') }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="$emit('remove-step')">
	      <v-list-item-icon>
	        <v-icon>mdi-delete</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>
						{{ $t('ui.component.step.menu.moveup') }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
export default {	
	name: 'ottra-step-menu',
	props: [ 'step_position', 'value' ],
	// Methods here, talk directly to vuex? OR? We just got the step, but not the task. 
}

</script>
