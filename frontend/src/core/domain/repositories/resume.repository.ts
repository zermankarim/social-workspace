import type { Resume } from "@/core/domain/entities/resume.entity";

export type CreateResumeInput = {
  fileName: string;
  fileUrl: string;
  sizeBytes: number;
};

export abstract class ResumeRepository {
  abstract listMine(): Promise<Resume[]>;
  abstract create(input: CreateResumeInput): Promise<Resume>;
  abstract remove(id: string): Promise<void>;
}
