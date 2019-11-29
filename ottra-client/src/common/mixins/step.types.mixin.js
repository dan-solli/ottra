import OttraInstructionStep from '@/components/steps/OttraInstructionStep'
import OttraPauseStep from '@/components/steps/OttraPauseStep'
import OttraTransportStep from '@/components/steps/OttraTransportStep'
import OttraTaskStep from '@/components/steps/OttraTaskStep'

export const STEP_INSTRUCTION = 1
export const STEP_PAUSE = 2
export const STEP_TRANSPORT = 3
export const STEP_TASK = 4

export const stepTypeMixin = {
	data() {
		return {
      base_step: {
        title: '',
        description: '',
        duration: '',
        energyExpense: 2,
        type: -1,
        visualAidImages: [],
        documents: [],
        saveStatus: false
      },
			STEP_INSTRUCTION,
			STEP_PAUSE,
			STEP_TRANSPORT,
			STEP_TASK,			
		}
	},
	methods: {
		stepFactory(step_type) {
      if (step_type === STEP_INSTRUCTION) {
        const the_step = Object.assign({}, this.base_step)
        the_step.type = STEP_INSTRUCTION
        return { component: OttraInstructionStep, data: the_step, editMode: true }
      }
      else if (step_type === STEP_PAUSE) {
        const the_step = Object.assign({}, this.base_step)
        the_step.type = STEP_PAUSE
        return { component: OttraPauseStep, data: the_step, editMode: true }
      }
      else if (step_type === STEP_TRANSPORT) {
        const the_step = Object.assign({}, this.base_step)
        the_step.type = STEP_TRANSPORT
        return { component: OttraTransportStep, data: the_step, editMode: true }
      }
      else if (step_type === STEP_TASK) {
        const the_step = Object.assign({}, this.base_step)
        the_step.type = STEP_TASK
        return { component: OttraTaskStep, data: the_step, editMode: true }
      }
		},
	}
}
