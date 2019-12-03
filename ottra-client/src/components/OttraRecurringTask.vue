<template>
	<v-row>
		<v-col cols="2">
			<v-text-field 
				v-model="payload.howOften"
				prepend-icon="mdi-calendar-repeat"
				label="(*) How many times per"
				hint="(*) The system will recalculate some things."
				v-on:change="$emit('set-recurrance-how-often', payload.howOften)"
				type="number"> 
			</v-text-field>
		</v-col>
		<v-col cols="9">
			<v-btn-toggle mandatory v-model="payload.recurrance"
						v-on:change="$emit('set-recurrance-what', payload.recurrance)">
				<v-btn v-for="btn in recurranceOptions" :key="btn.option" :value="btn.option">
					{{ btn.title }}
				</v-btn>
			</v-btn-toggle>
		</v-col>
	</v-row>
</template>

<script>

import {
	RECURRANCE_DAY, RECURRANCE_WEEK, RECURRANCE_MONTH, RECURRANCE_YEAR
} from '@/common/recurrance.types'

export default {
	name: 'ottra-recurring-task',
	data: function() {
		return {
			payload: {
				recurrance: this.RECURRANCE_DAY,
				howOften: 1,
			},
			recurranceOptions: [
				{ title: '(*) Day', option: this.RECURRANCE_DAY },
				{ title: '(*) Week', option: this.RECURRANCE_WEEK },
				{ title: '(*) Month', option: this.RECURRANCE_MONTH },
				{ title: '(*) Year', option: this.RECURRANCE_YEAR },
			],
		}
	},
}
</script>