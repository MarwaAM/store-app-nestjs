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
				gender: 'female',
			});
		}
	}

	create(createUserDto: CreateUserDto) {
		const { username, email, age, gender } = createUserDto;
		if (!username || !email || !age || !gender) {
			throw new Error('Invalid Input');
		}
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

	findOne(username: string): User | undefined {
		const foundUser = this.users.findIndex(user => user.username === username);

		if (foundUser >= 0) {
			return this.users[foundUser];
		}
		return undefined;
	}

	update(username: string, updateUserDto: UpdateUserDto) {
		const userIndex = this.users.findIndex(user => user.username === username);

		if (userIndex >= 0) {
			this.users[userIndex] = {
				username,
				id: this.users[userIndex].id,
				created_at: this.users[userIndex].created_at,
				email: this.users[userIndex].email,
				age: updateUserDto.age ?? this.users[userIndex].age,
				gender: updateUserDto.gender ?? this.users[userIndex].gender,
			};

			return this.users[userIndex];
		}
	}

	remove(username: string) {
		const foundUser = this.users.findIndex(user => user.username === username);
		if (foundUser >= 0) {
			const deletedUser = this.users.splice(foundUser)[0];

			return deletedUser;
		}
	}
}
