import type { Resume } from "@/core/domain/entities/resume.entity";
import {
  ResumeRepository,
  type CreateResumeInput,
} from "@/core/domain/repositories/resume.repository";
import type {
  CreateResumeRequestDto,
  ResumeResponseDto,
} from "@/infrastructure/api/dto/resume-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ResumeMapper } from "@/infrastructure/mappers/resume.mapper";

export class ResumeApiRepository extends ResumeRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async listMine(): Promise<Resume[]> {
    const response =
      await this.httpClient.request<ResumeResponseDto[]>("/resumes/me");
    return response.map((item) => ResumeMapper.fromApi(item));
  }

  async create(input: CreateResumeInput): Promise<Resume> {
    const body: CreateResumeRequestDto = input;
    const response = await this.httpClient.request<ResumeResponseDto>(
      "/resumes",
      { method: "POST", body },
    );
    return ResumeMapper.fromApi(response);
  }

  async remove(id: string): Promise<void> {
    await this.httpClient.request<void>(`/resumes/${id}`, {
      method: "DELETE",
    });
  }
}
