import type { UploadResult } from "@/core/domain/entities/upload-result.entity";

export abstract class UploadRepository {
  abstract upload(file: File): Promise<UploadResult>;
}
