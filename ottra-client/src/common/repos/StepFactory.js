import { v4 as uuidv4 } from 'uuid'

import OttraInstructionStepH from '@/components/steps/OttraInstructionStepHeader'
import OttraInstructionStepC from '@/components/steps/OttraInstructionStepContent'

import OttraPauseStepH from '@/components/steps/OttraPauseStepHeader'
import OttraPauseStepC from '@/components/steps/OttraPauseStepContent'

import OttraTransportStepH from '@/components/steps/OttraTransportStepHeader'
import OttraTransportStepC from '@/components/steps/OttraTransportStepContent'

import OttraTaskStepH from '@/components/steps/OttraTaskStepHeader'
import OttraTaskStepC from '@/components/steps/OttraTaskStepContent'



export const STEP_UNDEFINED = 0
export const STEP_INSTRUCTION = 1
export const STEP_PAUSE = 2
export const STEP_TRANSPORT = 3
export const STEP_TASK = 4

const stepTypeData = {
	base_step: {
		uuid: '',
    title: '',
    description: '',
    duration: '',
    energyExpense: 2,
    editMode: true,
    visualAidImages: [],
    saveStatus: false,
    optionalStep: false,
    stepType: 0
  },
  instruction_step: {
    tools: [],
    attachments: [],
    stepLocation: '',
  },
  pause_step: { /* Empty */  },
  task_step: {
    task: '',
  },
  transport_step: {
    destination: '',
    attachments: [],
    method: '',
  },
}

export const StepFactory = {
	getStepData: function(type) {
		const baseStep = Object.assign({}, stepTypeData.base_step)
		baseStep.uuid = uuidv4()
		baseStep.stepType = type

		if (type === STEP_INSTRUCTION) {
			return Object.assign(baseStep, stepTypeData.instruction_step)
		}
		else if (type === STEP_TRANSPORT) {
			return Object.assign(baseStep, stepTypeData.transport_step)
		} 
		else if (type === STEP_TASK) {
			return Object.assign(baseStep, stepTypeData.task_step)	
		} else {
			return Object.assign(baseStep, stepTypeData.pause_step)
		}
	},
	getStepHeaderComponent: function(type) {
		if (type === STEP_INSTRUCTION) {
			return OttraInstructionStepH
		}
		else if (type === STEP_TRANSPORT) {
			return OttraTransportStepH
		} 
		else if (type === STEP_TASK) {
			return OttraTaskStepH
		} else {
			return OttraPauseStepH
		}
	},
	getStepContentComponent: function(type) {
		if (type === STEP_INSTRUCTION) {
			return OttraInstructionStepC
		}
		else if (type === STEP_TRANSPORT) {
			return OttraTransportStepC
		} 
		else if (type === STEP_TASK) {
			return OttraTaskStepC
		} else {
			return OttraPauseStepC
		}
	}
}