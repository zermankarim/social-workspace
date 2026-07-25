import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { resumeSelect, ResumeSelected } from '../resumes.select';
import { CreateResumeDto } from '../dto/resume.dto';

@Injectable()
export class ResumesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<ResumeSelected[]> {
    return this.prisma.resume.findMany({
      where: { userId },
      select: resumeSelect,
      orderBy: { uploadedAt: 'desc' },
    });
  }

  countByUserId(userId: string): Promise<number> {
    return this.prisma.resume.count({ where: { userId } });
  }

  findOwnedById(id: string, userId: string): Promise<ResumeSelected | null> {
    return this.prisma.resume.findFirst({
      where: { id, userId },
      select: resumeSelect,
    });
  }

  create(userId: string, dto: CreateResumeDto): Promise<ResumeSelected> {
    return this.prisma.resume.create({
      data: {
        userId,
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        sizeBytes: dto.sizeBytes,
      },
      select: resumeSelect,
    });
  }

  async deleteOwned(id: string, userId: string): Promise<boolean> {
    const result = await this.prisma.resume.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}
