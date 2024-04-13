import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ROLES } from '..//auth/roles';
import { Roles } from '..//auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@Roles([ROLES.CAN_CREATE])
	create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
		try {
			const user = this.userService.create(createUserDto);
			return response.status(HttpStatus.CREATED).send(user);
		} catch {
			return response.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Get()
	@Roles([ROLES.ADMIN])
	findAll(): User[] {
		return this.userService.findAll();
	}

	@Get(':username')
	@Roles([ROLES.CAN_READ])
	findOne(@Param('username') username: string, @Res() response: Response) {
		const user = this.userService.findOne(username);
		if (user) {
			return response.status(HttpStatus.OK).send(user);
		}
		return response.status(HttpStatus.NOT_FOUND).send('User Not Found');
	}

	@Patch(':username')
	@Roles([ROLES.CAN_UPDATE])
	update(
		@Param('username') username: string,
		@Body() updateUserDto: UpdateUserDto,
		@Res() response: Response,
	) {
		const updatedUser = this.userService.update(username, updateUserDto);
		if (updatedUser) {
			return response.status(HttpStatus.OK).send(updatedUser);
		}
		return response.status(HttpStatus.NOT_FOUND).send('User Not Found');
	}

	@Delete(':username')
	@Roles([ROLES.CAN_UPDATE])
	remove(@Param('username') username: string, @Res() response: Response) {
		const deletedUser = this.userService.remove(username);
		if (deletedUser) {
			return response.status(HttpStatus.OK).send(deletedUser);
		}
		return response.status(HttpStatus.NOT_FOUND).send('User Not Found');
	}
}
