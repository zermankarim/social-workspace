import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { AppConfigModule } from './infrastructure/config/config.module';
import { AdminModule } from './admin/admin.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    UploadModule,
    AppConfigModule,
    AdminModule,
    PostsModule,
    CommentsModule,
    LikesModule,
  ],
})
export class AppModule {}
