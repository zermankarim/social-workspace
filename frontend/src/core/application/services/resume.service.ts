import type { Resume } from "@/core/domain/entities/resume.entity";
import type {
  CreateResumeInput,
  ResumeRepository,
} from "@/core/domain/repositories/resume.repository";

export class ResumeService {
  constructor(private readonly resumeRepository: ResumeRepository) {}

  listMine(): Promise<Resume[]> {
    return this.resumeRepository.listMine();
  }

  create(input: CreateResumeInput): Promise<Resume> {
    return this.resumeRepository.create(input);
  }

  remove(id: string): Promise<void> {
    return this.resumeRepository.remove(id);
  }
}
