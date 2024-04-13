import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ROLES } from '../auth/roles';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Mutation('createUser')
	@Roles([ROLES.CAN_CREATE])
	create(@Args('createUserInput') createUserInput: CreateUserDto) {
		return this.userService.create(createUserInput);
	}

	@Mutation('updateUser')
	@Roles([ROLES.CAN_UPDATE])
	update(@Args('updateUserInput') updateUserInput: UpdateUserDto) {
		return this.userService.update(updateUserInput.username, updateUserInput);
	}

	@Mutation('removeUser')
	@Roles([ROLES.CAN_UPDATE])
	remove(@Args('username') username: string) {
		return this.userService.remove(username);
	}

	@Query('GetAllUsers')
	@Roles([ROLES.ADMIN])
	findAll() {
		return this.userService.findAll();
	}

	@Query('GetUserByUsername')
	@Roles([ROLES.CAN_READ])
	findOne(@Args('username') username: string) {
		return this.userService.findOne(username);
	}
}
