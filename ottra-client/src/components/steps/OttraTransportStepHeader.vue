<template>
	<v-container>
		<v-row no-gutters>
			<v-col cols="2">
				<OttraStepMenu v-model="value.editMode"></OttraStepMenu>
				<OttraStepState v-model="value.saveState"></OttraStepState>
				<v-icon>{{ getTransportIcon(value.method) || 'mdi-train-car' }}</v-icon>
			</v-col>
			<v-col cols="4">
		    {{ getTransportText(value.method) || '<(*) New transport>' }}
			</v-col>
			<v-col cols="3">
				{{ value.destination }}
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
import { OttraTransportMixin } from '@/components/steps/mixins/OttraTransportMixin'
import OttraStepMenu from '@/components/steps/subcomponents/OttraStepMenu'

export default {
	name: 'ottra-transport-step-header',
	mixins: [ OttraStepMixin, OttraTransportMixin ],
}

</script>	