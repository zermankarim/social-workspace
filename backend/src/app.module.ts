import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AppConfigModule } from './infrastructure/config/config.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, AppConfigModule],
})
export class AppModule {}
