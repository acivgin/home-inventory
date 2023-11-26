import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { AtStrategy } from 'src/auth/strategy/at-strategy';
import { JwtAtGuard } from 'src/auth/guards';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, AtStrategy, JwtAtGuard],
})
export class UserModule {}
