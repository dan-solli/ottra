import UserRepo from "./userRepository"
import LocRepo from "./locationRepository"
import MsgRepo from './messageRepository'
import GroupRepo from './groupRepository'
import DocumentRepo from './documentRepository'
import TodoRepo from './todoRepository'
import RoomRepo from './roomRepository'
import StorageRepo from './storageRepository'
import EquipmentRepo from './equipmentRepository'

const repositories = {
	user: UserRepo,
	location: LocRepo,
	message: MsgRepo,
	group: GroupRepo,
	document: DocumentRepo,
	todo: TodoRepo,
	room: RoomRepo,
	storage: StorageRepo,
	equipment: EquipmentRepo,
};

export const RepositoryFactory = {
	get: name => repositories[name] // eslint-disable-line security/detect-object-injection
};