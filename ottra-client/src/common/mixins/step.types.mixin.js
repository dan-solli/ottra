export const STEP_INSTRUCTION = 1
export const STEP_PAUSE = 2
export const STEP_TRANSPORT = 3
export const STEP_TASK = 4

export const stepTypeMixin = {
	data() {
		return {
			STEP_INSTRUCTION,
			STEP_PAUSE,
			STEP_TRANSPORT,
			STEP_TASK
		}
	}
}
