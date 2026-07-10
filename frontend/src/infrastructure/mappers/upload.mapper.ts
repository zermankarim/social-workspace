import { UploadResult } from "@/core/domain/entities/upload-result.entity";
import type { UploadResponseDto } from "@/infrastructure/api/dto/upload-response.dto";

export class UploadMapper {
  static fromApi(dto: UploadResponseDto): UploadResult {
    return new UploadResult(dto.url, dto.fileName, dto.mimeType, dto.sizeBytes);
  }
}
