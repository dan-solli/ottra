<template>
	<v-menu offset-y>
		<template v-slot:activator="{ on }">
			<v-btn icon @click.native.stop="" v-on="on">
				<v-icon>mdi-menu</v-icon>
			</v-btn>
		</template>
		<v-list>
			<v-list-item @click="toggleEditMode">
	      <v-list-item-icon>
	        <v-icon v-if="value">mdi-content-save</v-icon>
	        <v-icon v-else>mdi-pencil</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) {{ value ? "Save" : "Edit" }} step</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="moveUp">
	      <v-list-item-icon>
	        <v-icon>mdi-arrow-up-bold</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) Move up</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="moveUp">
	      <v-list-item-icon>
	        <v-icon>>mdi-arrow-down-bold</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) Move down</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item @click="deleteStep">
	      <v-list-item-icon>
	        <v-icon>mdi-delete</v-icon>
	      </v-list-item-icon>				
	      <v-list-item-content>
					<v-list-item-title>(*) Delete step</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
export default {	
	name: 'ottra-step-menu',
	props: {
		value: {
			type: Boolean
		}
	},
	computed: {
		localValue: {
			get() { this.value },
			set(localValue) { this.$emit('input', localValue) }
		}
	},
	methods: {
		toggleEditMode: function() {
			if (this.value) {
				// Save it
			} else {
				// Edit it
			}
			this.localValue = !this.value
		},
		moveUp: function() {
			this.$emit('move-up')
		},
		moveDown: function() {
			this.$emit('move-down')
		},
		deleteStep: function() {
			this.$emit('delete-step')
		},
	}
}

</script>
