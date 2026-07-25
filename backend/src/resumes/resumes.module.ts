import { Module } from '@nestjs/common';
import { ResumesService } from './services/resumes.service';
import { ResumesController } from './controllers/resumes.controller';
import { ResumesRepository } from './repositories/resumes.repository';

@Module({
  controllers: [ResumesController],
  providers: [ResumesService, ResumesRepository],
  exports: [ResumesService],
})
export class ResumesModule {}
