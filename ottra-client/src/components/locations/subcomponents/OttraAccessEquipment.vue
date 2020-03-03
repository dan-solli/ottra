<template>
	<v-select
	  v-model="localValue"
	  :items="getEquipmentList"
	  prepend-icon="mdi-key-variant"
	  :menu-props="{ maxHeight: '400' }"
	  item-text="name"
	  item-value="uuid"
	  label="(*) Access Key"
	  multiple
	  chips
	  hint="(*) Equipment needed to access"
	  persistent-hint>
	</v-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'ottra-access-equipment',
	props: [ 'value' ],
	computed: {
		...mapGetters([
			"getEquipment"
		]),
		getEquipmentList: function() {
			return Object.values(this.getEquipment)
		},
		localValue: {
			get() { return this.value },
			set(localValue) { this.$emit('input', localValue)}
		}
	},
}
</script>	