import OttraInstructionStepH from '@/components/steps/OttraInstructionStepHeader'
import OttraInstructionStepC from '@/components/steps/OttraInstructionStepContent'

import OttraPauseStepH from '@/components/steps/OttraPauseStepHeader'
import OttraPauseStepC from '@/components/steps/OttraPauseStepContent'
import OttraTransportStepH from '@/components/steps/OttraTransportStepHeader'
import OttraTransportStepC from '@/components/steps/OttraTransportStepContent'
import OttraTaskStepH from '@/components/steps/OttraTaskStepHeader'
import OttraTaskStepC from '@/components/steps/OttraTaskStepContent'

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
        attachments: [],
        saveStatus: false,
        optionalStep: false,
      },
      instruction_step: {
        tools: {},
        stepLocation: '',
      },
      pause_step: { /* Empty */  },
      task_step: {
        task: '',
      },
      transport_step: {
        destination: '',
        method: '',
      },
			STEP_INSTRUCTION,
			STEP_PAUSE,
			STEP_TRANSPORT,
			STEP_TASK,			
		}
	},
	methods: {
		stepFactory(step_type, order) {
      if (step_type === STEP_INSTRUCTION) {
        const the_step = Object.assign(this.instruction_step, this.base_step)
        the_step.type = STEP_INSTRUCTION
        return { 
          componentHeader: OttraInstructionStepH, 
          componentContent: OttraInstructionStepC, 
          data: the_step, 
        }
      }
      else if (step_type === STEP_PAUSE) {
        const the_step = Object.assign(this.pause_step, this.base_step)
        the_step.type = STEP_PAUSE
        return { 
          componentHeader: OttraPauseStepH, 
          componentContent: OttraPauseStepC, 
          data: the_step, 
        }
      }
      else if (step_type === STEP_TRANSPORT) {
        const the_step = Object.assign(this.transport_step, this.base_step)
        the_step.type = STEP_TRANSPORT
        return { 
          componentHeader: OttraTransportStepH, 
          componentContent: OttraTransportStepC, 
          data: the_step, 
        }
      }
      else if (step_type === STEP_TASK) {
        const the_step = Object.assign(this.task_step, this.base_step)
        the_step.type = STEP_TASK
        return { 
          componentHeader: OttraTaskStepH, 
          componentContent: OttraTaskStepC, 
          data: the_step, 
        }
      }
		},
	}
}
