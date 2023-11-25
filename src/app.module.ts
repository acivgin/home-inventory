import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [PrismaModule, UserModule, PostsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
