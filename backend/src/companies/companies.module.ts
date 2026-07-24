import { Module } from '@nestjs/common';
import { CompaniesService } from './services/companies.service';
import { CompaniesController } from './controllers/companies.controller';
import { CompaniesRepository } from './repositories/companies.repository';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
})
export class CompaniesModule {}
