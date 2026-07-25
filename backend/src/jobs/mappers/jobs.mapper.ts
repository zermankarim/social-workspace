import { JobResponseDto } from '../dto/job.dto';
import { JobSelected } from '../jobs.select';

export class JobsMapper {
  static toResponseDto(job: JobSelected): JobResponseDto {
    return {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      company: job.company,
      location: job.location,
      description: job.description,
      applyUrl: job.applyUrl,
      employmentType: job.employmentType,
      workplaceType: job.workplaceType,
      experienceLevel: job.experienceLevel,
      applicationsCount: job._count.applications,
      poster: job.poster,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
