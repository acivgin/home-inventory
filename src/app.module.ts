import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
@Module({
  imports: [UserModule, PostsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
