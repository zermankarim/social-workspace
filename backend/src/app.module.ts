import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todo.module';
import { UploadModule } from './upload/upload.module';
import { AppConfigModule } from './infrastructure/config/config.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, TodosModule, UploadModule, AppConfigModule],
})
export class AppModule {}
