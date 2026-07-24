import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { AppConfigModule } from './infrastructure/config/config.module';
import { AdminModule } from './admin/admin.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { ConnectionsModule } from './connections/connections.module';
import { ConversationsModule } from './conversations/conversations.module';
import { DevicesModule } from './devices/devices.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FollowsModule } from './follows/follows.module';
import { SavedPostsModule } from './saved-posts/saved-posts.module';
import { ProfileViewsModule } from './profile-views/profile-views.module';
import { NewsModule } from './news/news.module';
import { ReportsModule } from './reports/reports.module';
import { GamificationModule } from './gamification/gamification.module';
import { JobsModule } from './jobs/jobs.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    UsersModule,
    UploadModule,
    AppConfigModule,
    AdminModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    ConnectionsModule,
    ConversationsModule,
    DevicesModule,
    HashtagsModule,
    NotificationsModule,
    FollowsModule,
    SavedPostsModule,
    ProfileViewsModule,
    NewsModule,
    ReportsModule,
    GamificationModule,
    JobsModule,
    CompaniesModule,
  ],
})
export class AppModule {}
