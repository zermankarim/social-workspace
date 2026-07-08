import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AdminController],
  imports: [AuthModule],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
