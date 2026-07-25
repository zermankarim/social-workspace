import { Resume } from "@/core/domain/entities/resume.entity";
import type { ResumeResponseDto } from "@/infrastructure/api/dto/resume-response.dto";

export class ResumeMapper {
  static fromApi(dto: ResumeResponseDto): Resume {
    return new Resume(
      dto.id,
      dto.fileName,
      dto.fileUrl,
      dto.sizeBytes,
      new Date(dto.uploadedAt),
    );
  }
}
