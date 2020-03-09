<template>
	<v-btn-toggle v-model="localValue" mandatory>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on"> 0 </v-btn>
			</template>
			<span>(*) No priority</span>
		</v-tooltip>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" class="red lighten-1"> ! </v-btn>
			</template>
			<span>(*) Important</span>
		</v-tooltip>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" class="red darken-2"> !! </v-btn>
			</template>
			<span>(*) Very important</span>
		</v-tooltip>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" class="red darken-4"> !!! </v-btn>
			</template>
			<span>(*) Critical</span>
		</v-tooltip>
	</v-btn-toggle>
</template>

<script>
export default {
	name: 'ottra-priority-strategy-default',
	props: [ 'value' ],
	computed: {
		localValue: {
			get() { return this.value },
			set(localValue) { this.$emit('input', localValue) }
		}
	}
}
</script>