import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobApplicationStatus } from '@prisma/client';
import { JobApplicationsRepository } from '../repositories/job-applications.repository';
import { JobApplicationSelected } from '../job-applications.select';
import { JobApplicationsMapper } from '../mappers/job-applications.mapper';
import { CreateJobApplicationDto } from '../dto/create-job-application.dto';
import { DecideJobApplicationDto } from '../dto/decide-job-application.dto';
import { JobApplicationResponseDto } from '../dto/job-application.dto';
import { PaginatedJobApplicationsQueryDto } from '../dto/paginated-job-applications-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { JobsRepository } from '../../jobs/repositories/jobs.repository';
import { CompaniesService } from '../../companies/services/companies.service';
import { ResumesService } from '../../resumes/services/resumes.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import {
  JOB_APPLICATION_ACCEPTED_EVENT,
  JOB_APPLICATION_SENT_EVENT,
} from '../../gamification/events/gamification.events';

@Injectable()
export class JobApplicationsService {
  constructor(
    private readonly jobApplicationsRepository: JobApplicationsRepository,
    private readonly jobsRepository: JobsRepository,
    private readonly companiesService: CompaniesService,
    private readonly resumesService: ResumesService,
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async getLastContactInfo(
    applicantId: string,
  ): Promise<{ contactEmail: string | null; contactPhone: string | null }> {
    const info =
      await this.jobApplicationsRepository.findLastContactInfo(applicantId);
    return info ?? { contactEmail: null, contactPhone: null };
  }

  public async apply(
    applicantId: string,
    jobId: string,
    dto: CreateJobApplicationDto,
  ): Promise<JobApplicationResponseDto> {
    const job = await this.jobsRepository.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (dto.resumeId) {
      await this.resumesService.assertOwnedOrThrow(applicantId, dto.resumeId);
    }

    const existing = await this.jobApplicationsRepository.findByJobAndApplicant(
      jobId,
      applicantId,
    );

    let application: JobApplicationSelected;
    if (!existing) {
      application = await this.jobApplicationsRepository.create(
        jobId,
        applicantId,
        dto,
      );
    } else if (
      existing.status === JobApplicationStatus.WITHDRAWN ||
      existing.status === JobApplicationStatus.REJECTED
    ) {
      application = await this.jobApplicationsRepository.reopen(
        existing.id,
        dto,
      );
    } else {
      throw new ConflictException('You already applied to this job');
    }

    await this.notifyReceivers(job.poster.id, job.companyId, applicantId);
    this.eventEmitter.emit(JOB_APPLICATION_SENT_EVENT, { applicantId });

    return JobApplicationsMapper.toResponseDto(application);
  }

  public async withdraw(
    applicantId: string,
    applicationId: string,
  ): Promise<JobApplicationResponseDto> {
    const application =
      await this.jobApplicationsRepository.findById(applicationId);
    if (!application || application.applicant.id !== applicantId) {
      throw new NotFoundException('Application not found');
    }
    if (application.status !== JobApplicationStatus.PENDING) {
      throw new BadRequestException(
        'Only a pending application can be withdrawn',
      );
    }
    const updated =
      await this.jobApplicationsRepository.withdraw(applicationId);
    return JobApplicationsMapper.toResponseDto(updated);
  }

  public async decide(
    deciderId: string,
    applicationId: string,
    dto: DecideJobApplicationDto,
  ): Promise<JobApplicationResponseDto> {
    const application =
      await this.jobApplicationsRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    const canManage = await this.jobsRepository.canManage(
      application.jobId,
      deciderId,
    );
    if (!canManage) {
      throw new ForbiddenException('Not allowed to decide on this application');
    }
    if (application.status !== JobApplicationStatus.PENDING) {
      throw new BadRequestException('This application was already decided');
    }

    const status = dto.status as JobApplicationStatus;
    const updated = await this.jobApplicationsRepository.updateStatus(
      applicationId,
      status,
      deciderId,
      dto.reason,
    );

    await this.notificationsService.notifyJobApplicationStatusChanged(
      deciderId,
      application.applicant.id,
    );
    if (status === JobApplicationStatus.ACCEPTED) {
      this.eventEmitter.emit(JOB_APPLICATION_ACCEPTED_EVENT, {
        applicantId: application.applicant.id,
      });
    }

    return JobApplicationsMapper.toResponseDto(updated);
  }

  public async listSent(
    applicantId: string,
    query: PaginatedJobApplicationsQueryDto,
  ): Promise<PaginatedResponseDto<JobApplicationResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const [items, total] = await Promise.all([
      this.jobApplicationsRepository.findSentByApplicant(
        applicantId,
        skip,
        take,
        query.status,
      ),
      this.jobApplicationsRepository.countSentByApplicant(
        applicantId,
        query.status,
      ),
    ]);
    return {
      data: items.map((item) => JobApplicationsMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async listReceived(
    userId: string,
    query: PaginatedJobApplicationsQueryDto,
  ): Promise<PaginatedResponseDto<JobApplicationResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const [items, total] = await Promise.all([
      this.jobApplicationsRepository.findReceivedForUser(
        userId,
        skip,
        take,
        query.status,
      ),
      this.jobApplicationsRepository.countReceivedForUser(userId, query.status),
    ]);
    return {
      data: items.map((item) => JobApplicationsMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async listReceivedForJob(
    userId: string,
    jobId: string,
    query: PaginatedJobApplicationsQueryDto,
  ): Promise<PaginatedResponseDto<JobApplicationResponseDto>> {
    const canManage = await this.jobsRepository.canManage(jobId, userId);
    if (!canManage) {
      throw new ForbiddenException('Not allowed to view these applications');
    }
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const [items, total] = await Promise.all([
      this.jobApplicationsRepository.findReceivedForJob(
        jobId,
        skip,
        take,
        query.status,
      ),
      this.jobApplicationsRepository.countReceivedForJob(jobId, query.status),
    ]);
    return {
      data: items.map((item) => JobApplicationsMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  private async notifyReceivers(
    posterId: string,
    companyId: string | null,
    applicantId: string,
  ): Promise<void> {
    if (companyId) {
      const admins = await this.companiesService.listAdmins(companyId);
      await Promise.all(
        admins.map((admin) =>
          this.notificationsService.notifyJobApplicationReceived(
            applicantId,
            admin.user.id,
          ),
        ),
      );
      return;
    }
    await this.notificationsService.notifyJobApplicationReceived(
      applicantId,
      posterId,
    );
  }
}
