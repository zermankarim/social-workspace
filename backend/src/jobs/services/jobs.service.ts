import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
import { CompaniesService } from '../../companies/services/companies.service';

@Injectable()
export class JobsService {
  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly companiesService: CompaniesService,
  ) {}

  public async getFeedPaginated(
    query: PaginatedJobsQueryDto,
  ): Promise<PaginatedResponseDto<JobResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const where: Prisma.JobWhereInput = {
      ...(query.q?.trim()
        ? {
            OR: [
              { title: { contains: query.q.trim(), mode: 'insensitive' } },
              {
                description: {
                  contains: query.q.trim(),
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
      ...(query.location?.trim()
        ? { location: { contains: query.location.trim(), mode: 'insensitive' } }
        : {}),
      ...(query.companyId ? { companyId: query.companyId } : {}),
      ...(query.employmentType ? { employmentType: query.employmentType } : {}),
      ...(query.workplaceType ? { workplaceType: query.workplaceType } : {}),
      ...(query.experienceLevel
        ? { experienceLevel: query.experienceLevel }
        : {}),
    };

    const [jobs, total] = await Promise.all([
      this.jobsRepository.findMany(where, skip, take),
      this.jobsRepository.count(where),
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
    let companyName = dto.companyName;

    if (dto.companyId) {
      await this.companiesService.assertAdminOrThrow(dto.companyId, posterId);
      const company = await this.companiesService.getCompanyById(dto.companyId);
      companyName = company.name;
    }

    if (!companyName) {
      throw new BadRequestException(
        'companyName is required when companyId is not set',
      );
    }

    const job = await this.jobsRepository.create(posterId, {
      title: dto.title,
      companyId: dto.companyId,
      companyName,
      location: dto.location,
      description: dto.description,
      applyUrl: dto.applyUrl,
      employmentType: dto.employmentType,
      workplaceType: dto.workplaceType,
      experienceLevel: dto.experienceLevel,
    });
    return JobsMapper.toResponseDto(job);
  }

  public async deleteJob(userId: string, jobId: string): Promise<void> {
    const job = await this.jobsRepository.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const canManage = await this.jobsRepository.canManage(jobId, userId);
    if (!canManage) {
      throw new ForbiddenException('Not allowed to delete this job');
    }
    await this.jobsRepository.deleteById(jobId);
  }
}
