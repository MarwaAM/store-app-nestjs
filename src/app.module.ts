import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';

@Module({
	imports: [UserModule, CartModule, ConfigModule.forRoot()],
	controllers: [AppController, UserController],
	providers: [AppService, UserService, UserResolver],
})
export class AppModule {}
