import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): GetUserDto[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() response: Response) {
    const user = this.userService.findOne(+id);
    if (user) {
      return response.status(HttpStatus.OK).send(user);
    }
    return response.status(HttpStatus.NOT_FOUND).send('User Not Found');
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const updatedUser = this.userService.update(+id, updateUserDto);
    if (updatedUser) {
      return updatedUser;
    }
    return response.status(HttpStatus.NOT_FOUND).send('User Not Found');
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() response: Response) {
    const deletedUser = this.userService.remove(+id);
    if (deletedUser) {
      return deletedUser;
    }
    return response.status(HttpStatus.NOT_FOUND).send('User Not Found');
  }
}
