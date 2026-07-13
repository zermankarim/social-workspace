import {
  ProfileRepository,
  type EducationInput,
  type UpdateProfileInput,
  type WorkExperienceInput,
} from "@/core/domain/repositories/profile.repository";
import { Education } from "@/core/domain/entities/education.entity";
import {
  PaginatedLanguages,
  PaginatedSkills,
} from "@/core/domain/entities/paginated-catalog.entity";
import { PaginatedUserSearch } from "@/core/domain/entities/paginated-user-search.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { Skill } from "@/core/domain/entities/skill.entity";
import type { UserLanguage } from "@/core/domain/entities/user-language.entity";
import type { UserProfile } from "@/core/domain/entities/user-profile.entity";
import type { WorkExperience } from "@/core/domain/entities/work-experience.entity";
import type { LanguageProficiency } from "@/core/domain/enums/language-proficiency.enum";
import type {
  EducationResponseDto,
  PaginatedLanguagesResponseDto,
  PaginatedSkillsResponseDto,
  PaginatedUserSearchResponseDto,
  PrivateUserProfileResponseDto,
  PublicUserProfileResponseDto,
  SkillResponseDto,
  UserLanguageResponseDto,
  WorkExperienceResponseDto,
} from "@/infrastructure/api/dto/profile-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ConnectionMapper } from "@/infrastructure/mappers/connection.mapper";
import { ProfileMapper } from "@/infrastructure/mappers/profile.mapper";

export class ProfileApiRepository extends ProfileRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async getMe(): Promise<UserProfile> {
    const response =
      await this.httpClient.request<PrivateUserProfileResponseDto>("/users/me");
    return ProfileMapper.profileFromApi(response);
  }

  async getById(id: string): Promise<UserProfile> {
    const response =
      await this.httpClient.request<PublicUserProfileResponseDto>(
        `/users/${id}`,
      );
    return ProfileMapper.profileFromApi(response);
  }

  async updateMe(input: UpdateProfileInput): Promise<UserProfile> {
    const response =
      await this.httpClient.request<PrivateUserProfileResponseDto>(
        "/users/me",
        { method: "PATCH", body: input },
      );
    return ProfileMapper.profileFromApi(response);
  }

  async createExperience(input: WorkExperienceInput): Promise<WorkExperience> {
    const response = await this.httpClient.request<WorkExperienceResponseDto>(
      "/users/me/experiences",
      { method: "POST", body: input },
    );
    return ProfileMapper.experienceFromApi(response);
  }

  async updateExperience(
    id: string,
    input: Partial<WorkExperienceInput>,
  ): Promise<WorkExperience> {
    const response = await this.httpClient.request<WorkExperienceResponseDto>(
      `/users/me/experiences/${id}`,
      { method: "PATCH", body: input },
    );
    return ProfileMapper.experienceFromApi(response);
  }

  async deleteExperience(id: string): Promise<void> {
    await this.httpClient.request<void>(`/users/me/experiences/${id}`, {
      method: "DELETE",
    });
  }

  async createEducation(input: EducationInput): Promise<Education> {
    const response = await this.httpClient.request<EducationResponseDto>(
      "/users/me/educations",
      { method: "POST", body: input },
    );
    return ProfileMapper.educationFromApi(response);
  }

  async updateEducation(
    id: string,
    input: Partial<EducationInput>,
  ): Promise<Education> {
    const response = await this.httpClient.request<EducationResponseDto>(
      `/users/me/educations/${id}`,
      { method: "PATCH", body: input },
    );
    return ProfileMapper.educationFromApi(response);
  }

  async deleteEducation(id: string): Promise<void> {
    await this.httpClient.request<void>(`/users/me/educations/${id}`, {
      method: "DELETE",
    });
  }

  async createLanguage(
    languageId: string,
    proficiency: LanguageProficiency,
  ): Promise<UserLanguage> {
    const response = await this.httpClient.request<UserLanguageResponseDto>(
      "/users/me/languages",
      { method: "POST", body: { languageId, proficiency } },
    );
    return ProfileMapper.userLanguageFromApi(response);
  }

  async updateLanguage(
    id: string,
    proficiency: LanguageProficiency,
  ): Promise<UserLanguage> {
    const response = await this.httpClient.request<UserLanguageResponseDto>(
      `/users/me/languages/${id}`,
      { method: "PATCH", body: { proficiency } },
    );
    return ProfileMapper.userLanguageFromApi(response);
  }

  async deleteLanguage(id: string): Promise<void> {
    await this.httpClient.request<void>(`/users/me/languages/${id}`, {
      method: "DELETE",
    });
  }

  async addSkill(input: { skillId?: string; name?: string }): Promise<Skill> {
    const response = await this.httpClient.request<SkillResponseDto>(
      "/users/me/skills",
      { method: "POST", body: input },
    );
    return ProfileMapper.skillFromApi(response);
  }

  async removeSkill(skillId: string): Promise<void> {
    await this.httpClient.request<void>(`/users/me/skills/${skillId}`, {
      method: "DELETE",
    });
  }

  async searchLanguages(
    q: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedLanguages> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (q.trim()) params.set("q", q.trim());

    const response =
      await this.httpClient.request<PaginatedLanguagesResponseDto>(
        `/languages?${params.toString()}`,
      );

    return new PaginatedLanguages(
      response.data.map((item) => ProfileMapper.languageFromApi(item)),
      new PaginationMeta(
        response.meta.page,
        response.meta.limit,
        response.meta.total,
        response.meta.totalPages,
        response.meta.hasNextPage,
        response.meta.hasPrevPage,
      ),
    );
  }

  async searchSkills(
    q: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedSkills> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (q.trim()) params.set("q", q.trim());

    const response = await this.httpClient.request<PaginatedSkillsResponseDto>(
      `/skills?${params.toString()}`,
    );

    return new PaginatedSkills(
      response.data.map((item) => ProfileMapper.skillFromApi(item)),
      new PaginationMeta(
        response.meta.page,
        response.meta.limit,
        response.meta.total,
        response.meta.totalPages,
        response.meta.hasNextPage,
        response.meta.hasPrevPage,
      ),
    );
  }

  async searchUsers(
    q: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedUserSearch> {
    const trimmed = q.trim();
    if (!trimmed) {
      return new PaginatedUserSearch(
        [],
        new PaginationMeta(page, limit, 0, 1, false, false),
      );
    }

    const params = new URLSearchParams({
      q: trimmed,
      page: String(page),
      limit: String(limit),
    });

    const response =
      await this.httpClient.request<PaginatedUserSearchResponseDto>(
        `/users/search?${params.toString()}`,
      );

    return new PaginatedUserSearch(
      response.data.map((item) => ConnectionMapper.userFromApi(item)),
      new PaginationMeta(
        response.meta.page,
        response.meta.limit,
        response.meta.total,
        response.meta.totalPages,
        response.meta.hasNextPage,
        response.meta.hasPrevPage,
      ),
    );
  }
}
