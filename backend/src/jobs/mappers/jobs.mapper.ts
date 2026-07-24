import { JobResponseDto } from '../dto/job.dto';
import { JobSelected } from '../jobs.select';

export class JobsMapper {
  static toResponseDto(job: JobSelected): JobResponseDto {
    return {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      description: job.description,
      applyUrl: job.applyUrl,
      poster: job.poster,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
