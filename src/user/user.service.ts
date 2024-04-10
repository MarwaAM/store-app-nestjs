import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private users: User[] = [];

  onModuleInit() {
    for (let i = 0; i < 100; i++) {
      this.users.push({
        userName: `User${i}`,
        password: `User${i}`,
        id: i,
        age: Math.round(Math.random() * 80),
      });
    }
  }

  create(createUserDto: CreateUserDto) {
    const createdUser = {
      ...createUserDto,
      id: this.users.length + 1,
    };
    this.users.push(createdUser);

    delete createdUser.password;
    return createdUser;
  }

  findAll(): GetUserDto[] {
    return this.users.map((user) => {
      return {
        id: user.id,
        userName: user.userName,
        age: user.age,
      };
    });
  }

  findOne(id: number): GetUserDto | undefined {
    const foundUser = this.users.findIndex((user) => user.id === id);

    if (foundUser >= 0) {
      const user = this.users[foundUser];

      return {
        userName: user.userName,
        id: user.id,
        age: user.age,
      };
    }
    return undefined;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const foundUser = this.users.findIndex((user) => user.id === id);
    if (foundUser >= 0) {
      this.users[foundUser] = Object.assign(
        { ...this.users[foundUser] },
        updateUserDto,
      );

      const updatedUser = this.users[foundUser];
      return {
        id: updatedUser.id,
        userName: updatedUser.userName,
        age: updatedUser.age,
      };
    }
  }

  remove(id: number) {
    const foundUser = this.users.findIndex((user) => user.id === id);
    if (foundUser >= 0) {
      const deletedUser = this.users.splice(foundUser)[0];

      return deletedUser;
    }
  }
}
