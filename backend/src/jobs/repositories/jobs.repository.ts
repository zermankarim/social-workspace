import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { jobSelect, JobSelected } from '../jobs.select';

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(
    where: Prisma.JobWhereInput,
    skip: number,
    take: number,
  ): Promise<JobSelected[]> {
    return this.prisma.job.findMany({
      where,
      select: jobSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  count(where: Prisma.JobWhereInput): Promise<number> {
    return this.prisma.job.count({ where });
  }

  findById(id: string): Promise<JobSelected | null> {
    return this.prisma.job.findUnique({ where: { id }, select: jobSelect });
  }

  create(
    posterId: string,
    data: {
      title: string;
      companyId?: string;
      companyName: string;
      location?: string;
      description: string;
      applyUrl?: string;
      employmentType?: Prisma.JobCreateInput['employmentType'];
      workplaceType?: Prisma.JobCreateInput['workplaceType'];
      experienceLevel?: Prisma.JobCreateInput['experienceLevel'];
    },
  ): Promise<JobSelected> {
    return this.prisma.job.create({
      data: {
        poster: { connect: { id: posterId } },
        ...(data.companyId
          ? { company: { connect: { id: data.companyId } } }
          : {}),
        title: data.title,
        companyName: data.companyName,
        location: data.location,
        description: data.description,
        applyUrl: data.applyUrl,
        employmentType: data.employmentType,
        workplaceType: data.workplaceType,
        experienceLevel: data.experienceLevel,
      },
      select: jobSelect,
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.job.deleteMany({ where: { id } });
    return result.count > 0;
  }

  /** True when `userId` is the poster, or an admin of the job's company. */
  async canManage(jobId: string, userId: string): Promise<boolean> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: {
        posterId: true,
        companyId: true,
        company: {
          select: { admins: { where: { userId }, select: { id: true } } },
        },
      },
    });
    if (!job) return false;
    if (job.posterId === userId) return true;
    return Boolean(job.company?.admins.length);
  }
}
