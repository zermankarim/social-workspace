import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResumesRepository } from '../repositories/resumes.repository';
import { CreateResumeDto, ResumeResponseDto } from '../dto/resume.dto';

export const RESUMES_MAX_COUNT = 3;

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumesRepository) {}

  public listMine(userId: string): Promise<ResumeResponseDto[]> {
    return this.resumesRepository.findByUserId(userId);
  }

  public async createResume(
    userId: string,
    dto: CreateResumeDto,
  ): Promise<ResumeResponseDto> {
    const count = await this.resumesRepository.countByUserId(userId);
    if (count >= RESUMES_MAX_COUNT) {
      throw new BadRequestException(
        `You can only keep up to ${RESUMES_MAX_COUNT} resumes — delete one first`,
      );
    }
    return this.resumesRepository.create(userId, dto);
  }

  public async deleteResume(userId: string, resumeId: string): Promise<void> {
    const removed = await this.resumesRepository.deleteOwned(resumeId, userId);
    if (!removed) {
      throw new NotFoundException('Resume not found');
    }
  }

  public async assertOwnedOrThrow(
    userId: string,
    resumeId: string,
  ): Promise<void> {
    const resume = await this.resumesRepository.findOwnedById(resumeId, userId);
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
  }
}
