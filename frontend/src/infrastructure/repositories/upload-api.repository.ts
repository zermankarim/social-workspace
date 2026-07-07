import type { UploadResult } from "@/core/domain/entities/upload-result.entity";
import { UploadRepository } from "@/core/domain/repositories/upload.repository";
import type { UploadResponseDto } from "@/infrastructure/api/dto/upload-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { UploadMapper } from "@/infrastructure/mappers/upload.mapper";

export class UploadApiRepository extends UploadRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async upload(file: File): Promise<UploadResult> {
    const response = await this.httpClient.upload<UploadResponseDto>(
      "/upload",
      file,
    );
    return UploadMapper.fromApi(response);
  }
}
