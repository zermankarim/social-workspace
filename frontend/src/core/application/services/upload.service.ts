import type { UploadResult } from "@/core/domain/entities/upload-result.entity";
import type { UploadRepository } from "@/core/domain/repositories/upload.repository";

export class UploadService {
  constructor(private readonly uploadRepository: UploadRepository) {}

  upload(file: File): Promise<UploadResult> {
    return this.uploadRepository.upload(file);
  }

  uploadMany(files: File[]): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.uploadRepository.upload(file)));
  }
}
