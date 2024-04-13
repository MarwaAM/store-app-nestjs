import { PartialType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

// TODO fix type, should only allow update few
export class UpdateUserDto extends PartialType(CreateUserDto) {
	username: string;
}
