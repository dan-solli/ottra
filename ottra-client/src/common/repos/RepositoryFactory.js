import UserRepo from "./userRepository"
import LocRepo from "./locationRepository"
import MsgRepo from './messageRepository'
import GroupRepo from './groupRepository'
import DocumentRepo from './documentRepository'
import TodoRepo from './todoRepository'

const repositories = {
	user: UserRepo,
	location: LocRepo,
	message: MsgRepo,
	group: GroupRepo,
	document: DocumentRepo,
	todo: TodoRepo
};

export const RepositoryFactory = {
	get: name => repositories[name] // eslint-disable-line security/detect-object-injection
};