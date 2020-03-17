<template>
	<v-container>
		<v-row>
			<v-col cols="2">
				<OttraStepMenu v-model="value.editMode"></OttraStepMenu>
				<OttraStepState v-model="value.saveState"></OttraStepState>
				<v-icon>mdi-bell-sleep</v-icon>
			</v-col>
			<v-col cols="7">
		    {{ value.title || '<(*) New pause>' }}
			</v-col>
			<v-col cols="3">
				{{ value.duration }}
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import OttraStepState from '@/components/OttraStepState'
import { OttraStepMixin } from '@/components/steps/mixins/OttraStepMixin'
import OttraStepMenu from '@/components/steps/subcomponents/OttraStepMenu'

export default {
	name: 'ottra-pause-step-header',
	mixins: [ OttraStepMixin ],
	props: [ 'value' ],
	components: {
		OttraStepState,
		OttraStepMenu
	},
}

</script>	