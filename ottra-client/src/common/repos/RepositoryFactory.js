import UserRepo from "./userRepository";
import LocRepo from "./locationRepository";
import MsgRepo from './messageRepository'

const repositories = {
	user: UserRepo,
	location: LocRepo,
	message: MsgRepo
};

export const RepositoryFactory = {
	get: name => repositories[name]
};