import { Injectable } from '@nestjs/common';
import { JobApplicationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  jobApplicationSelect,
  JobApplicationSelected,
} from '../job-applications.select';
import { CreateJobApplicationDto } from '../dto/create-job-application.dto';

@Injectable()
export class JobApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<JobApplicationSelected | null> {
    return this.prisma.jobApplication.findUnique({
      where: { id },
      select: jobApplicationSelect,
    });
  }

  findByJobAndApplicant(
    jobId: string,
    applicantId: string,
  ): Promise<JobApplicationSelected | null> {
    return this.prisma.jobApplication.findUnique({
      where: { jobId_applicantId: { jobId, applicantId } },
      select: jobApplicationSelect,
    });
  }

  /** Used to prefill the contact-info step with whatever was entered last time. */
  async findLastContactInfo(applicantId: string): Promise<{
    contactEmail: string | null;
    contactPhone: string | null;
  } | null> {
    return this.prisma.jobApplication.findFirst({
      where: {
        applicantId,
        OR: [{ contactEmail: { not: null } }, { contactPhone: { not: null } }],
      },
      orderBy: { createdAt: 'desc' },
      select: { contactEmail: true, contactPhone: true },
    });
  }

  create(
    jobId: string,
    applicantId: string,
    dto: CreateJobApplicationDto,
  ): Promise<JobApplicationSelected> {
    return this.prisma.jobApplication.create({
      data: {
        jobId,
        applicantId,
        resumeId: dto.resumeId,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        coverNote: dto.coverNote,
      },
      select: jobApplicationSelect,
    });
  }

  /** Re-opens a WITHDRAWN/REJECTED row back to PENDING, clearing any prior decision. */
  reopen(
    id: string,
    dto: CreateJobApplicationDto,
  ): Promise<JobApplicationSelected> {
    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        status: JobApplicationStatus.PENDING,
        resumeId: dto.resumeId ?? null,
        contactEmail: dto.contactEmail ?? null,
        contactPhone: dto.contactPhone ?? null,
        coverNote: dto.coverNote ?? null,
        decisionReason: null,
        decidedAt: null,
        decidedByUserId: null,
      },
      select: jobApplicationSelect,
    });
  }

  updateStatus(
    id: string,
    status: JobApplicationStatus,
    decidedByUserId: string,
    reason?: string,
  ): Promise<JobApplicationSelected> {
    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        status,
        decisionReason: reason ?? null,
        decidedAt: new Date(),
        decidedByUserId,
      },
      select: jobApplicationSelect,
    });
  }

  withdraw(id: string): Promise<JobApplicationSelected> {
    return this.prisma.jobApplication.update({
      where: { id },
      data: { status: JobApplicationStatus.WITHDRAWN },
      select: jobApplicationSelect,
    });
  }

  findSentByApplicant(
    applicantId: string,
    skip: number,
    take: number,
    status?: JobApplicationStatus,
  ): Promise<JobApplicationSelected[]> {
    return this.prisma.jobApplication.findMany({
      where: { applicantId, ...(status ? { status } : {}) },
      select: jobApplicationSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countSentByApplicant(
    applicantId: string,
    status?: JobApplicationStatus,
  ): Promise<number> {
    return this.prisma.jobApplication.count({
      where: { applicantId, ...(status ? { status } : {}) },
    });
  }

  private receivedForUserWhere(
    userId: string,
  ): Prisma.JobApplicationWhereInput {
    return {
      job: {
        OR: [
          { posterId: userId },
          { company: { admins: { some: { userId } } } },
        ],
      },
    };
  }

  findReceivedForUser(
    userId: string,
    skip: number,
    take: number,
    status?: JobApplicationStatus,
  ): Promise<JobApplicationSelected[]> {
    return this.prisma.jobApplication.findMany({
      where: {
        ...this.receivedForUserWhere(userId),
        ...(status ? { status } : {}),
      },
      select: jobApplicationSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countReceivedForUser(
    userId: string,
    status?: JobApplicationStatus,
  ): Promise<number> {
    return this.prisma.jobApplication.count({
      where: {
        ...this.receivedForUserWhere(userId),
        ...(status ? { status } : {}),
      },
    });
  }

  findReceivedForJob(
    jobId: string,
    skip: number,
    take: number,
    status?: JobApplicationStatus,
  ): Promise<JobApplicationSelected[]> {
    return this.prisma.jobApplication.findMany({
      where: { jobId, ...(status ? { status } : {}) },
      select: jobApplicationSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countReceivedForJob(
    jobId: string,
    status?: JobApplicationStatus,
  ): Promise<number> {
    return this.prisma.jobApplication.count({
      where: { jobId, ...(status ? { status } : {}) },
    });
  }

  countAcceptedByApplicant(applicantId: string): Promise<number> {
    return this.prisma.jobApplication.count({
      where: { applicantId, status: JobApplicationStatus.ACCEPTED },
    });
  }
}
