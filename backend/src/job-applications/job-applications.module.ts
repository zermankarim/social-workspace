import { Module } from '@nestjs/common';
import { JobApplicationsService } from './services/job-applications.service';
import { JobApplicationsController } from './controllers/job-applications.controller';
import { JobApplyController } from './controllers/job-apply.controller';
import { JobApplicationsRepository } from './repositories/job-applications.repository';
import { JobsModule } from '../jobs/jobs.module';
import { CompaniesModule } from '../companies/companies.module';
import { ResumesModule } from '../resumes/resumes.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [JobsModule, CompaniesModule, ResumesModule, NotificationsModule],
  controllers: [JobApplicationsController, JobApplyController],
  providers: [JobApplicationsService, JobApplicationsRepository],
})
export class JobApplicationsModule {}
