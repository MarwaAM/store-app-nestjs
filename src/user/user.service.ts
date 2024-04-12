import { Injectable, OnModuleInit } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService implements OnModuleInit {
	private users: User[] = [];

	onModuleInit() {
		// create random users for dev purpose
		for (let i = 0; i < 100; i++) {
			this.users.push({
				username: `User${i}`,
				email: `User${i}@test.com`,
				created_at: new Date().toISOString(),
				id: i,
				age: Math.round(Math.random() * 80),
			});
		}
	}

	create(createUserDto: CreateUserDto) {
		const createdUser: User = {
			...createUserDto,
			id: this.users.length + 1,
			created_at: new Date().toISOString(),
		};
		this.users.push(createdUser);

		return createdUser;
	}

	findAll(): User[] {
		return this.users;
	}

	findOne(id: number): User | undefined {
		const foundUser = this.users.findIndex(user => user.id === id);

		if (foundUser >= 0) {
			return this.users[foundUser];
		}
		return undefined;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		const foundUser = this.users.findIndex(user => user.id === id);
		if (foundUser >= 0) {
			this.users[foundUser] = Object.assign({ ...this.users[foundUser] }, updateUserDto);

			return this.users[foundUser];
		}
	}

	remove(id: number) {
		const foundUser = this.users.findIndex(user => user.id === id);
		if (foundUser >= 0) {
			const deletedUser = this.users.splice(foundUser)[0];

			return deletedUser;
		}
	}
}
