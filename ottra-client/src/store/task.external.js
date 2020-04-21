/**
* This file contains the actions and getters being used by components in the application
* It's a public layer, so to speak.
*/

import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const TaskRepo = RepositoryFactory.get('task')

const TaskExternal = {
	actions: {
	},
}

export default TaskExternal