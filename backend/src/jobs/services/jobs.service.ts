import { Injectable, NotFoundException } from '@nestjs/common';
import { JobsRepository } from '../repositories/jobs.repository';
import { JobsMapper } from '../mappers/jobs.mapper';
import { CreateJobDto } from '../dto/create-job.dto';
import { JobResponseDto } from '../dto/job.dto';
import { PaginatedJobsQueryDto } from '../dto/paginated-jobs-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  public async getFeedPaginated(
    query: PaginatedJobsQueryDto,
  ): Promise<PaginatedResponseDto<JobResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [jobs, total] = await Promise.all([
      this.jobsRepository.findMany(skip, take),
      this.jobsRepository.count(),
    ]);

    return {
      data: jobs.map((job) => JobsMapper.toResponseDto(job)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getJobById(id: string): Promise<JobResponseDto> {
    const job = await this.jobsRepository.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return JobsMapper.toResponseDto(job);
  }

  public async createJob(
    posterId: string,
    dto: CreateJobDto,
  ): Promise<JobResponseDto> {
    const job = await this.jobsRepository.create(posterId, dto);
    return JobsMapper.toResponseDto(job);
  }

  public async deleteJob(userId: string, jobId: string): Promise<void> {
    const removed = await this.jobsRepository.deleteOwned(jobId, userId);
    if (!removed) {
      throw new NotFoundException('Job not found');
    }
  }
}
