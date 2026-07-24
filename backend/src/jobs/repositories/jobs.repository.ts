import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { jobSelect, JobSelected } from '../jobs.select';
import { CreateJobDto } from '../dto/create-job.dto';

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(skip: number, take: number): Promise<JobSelected[]> {
    return this.prisma.job.findMany({
      select: jobSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  count(): Promise<number> {
    return this.prisma.job.count();
  }

  findById(id: string): Promise<JobSelected | null> {
    return this.prisma.job.findUnique({ where: { id }, select: jobSelect });
  }

  create(posterId: string, dto: CreateJobDto): Promise<JobSelected> {
    return this.prisma.job.create({
      data: {
        poster: { connect: { id: posterId } },
        title: dto.title,
        companyName: dto.companyName,
        location: dto.location,
        description: dto.description,
        applyUrl: dto.applyUrl,
      },
      select: jobSelect,
    });
  }

  async deleteOwned(id: string, posterId: string): Promise<boolean> {
    const result = await this.prisma.job.deleteMany({
      where: { id, posterId },
    });
    return result.count > 0;
  }
}
