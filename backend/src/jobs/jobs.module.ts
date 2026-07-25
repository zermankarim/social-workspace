import { Module } from '@nestjs/common';
import { JobsService } from './services/jobs.service';
import { JobsController } from './controllers/jobs.controller';
import { JobsRepository } from './repositories/jobs.repository';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository],
  exports: [JobsService, JobsRepository],
})
export class JobsModule {}
