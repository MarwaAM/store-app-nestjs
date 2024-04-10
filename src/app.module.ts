import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { CartModule } from './cart/cart.module';
import { UserResolver } from './user/user.resolver';

@Module({
  imports: [UserModule, CartModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, UserResolver],
})
export class AppModule {}
