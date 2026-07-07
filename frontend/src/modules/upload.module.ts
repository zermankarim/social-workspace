import { UploadService } from "@/core/application/services/upload.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { UploadApiRepository } from "@/infrastructure/repositories/upload-api.repository";

export class UploadModule {
  static create(httpClient: HttpClient): UploadService {
    const repository = new UploadApiRepository(httpClient);
    return new UploadService(repository);
  }
}
