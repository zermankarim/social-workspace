import type {
  PaginatedLanguages,
  PaginatedSkills,
} from "@/core/domain/entities/paginated-catalog.entity";
import type { PaginatedUserSearch } from "@/core/domain/entities/paginated-user-search.entity";
import type { Skill } from "@/core/domain/entities/skill.entity";
import type { UserLanguage } from "@/core/domain/entities/user-language.entity";
import type { UserProfile } from "@/core/domain/entities/user-profile.entity";
import type { WorkExperience } from "@/core/domain/entities/work-experience.entity";
import type { Education } from "@/core/domain/entities/education.entity";
import type { EducationDegree } from "@/core/domain/enums/education-degree.enum";
import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { LanguageProficiency } from "@/core/domain/enums/language-proficiency.enum";
import type { PreferredLocale } from "@/core/domain/enums/preferred-locale.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  headline?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  preferredLocale?: PreferredLocale;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
};

export type WorkExperienceInput = {
  title: string;
  employmentType: EmploymentType;
  companyName: string;
  startDate: string;
  endDate?: string | null;
  workplaceType: WorkplaceType;
  description?: string | null;
};

export type EducationInput = {
  schoolName: string;
  degree: EducationDegree;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  gradePoint?: number | null;
  skillNames?: string[];
};

export abstract class ProfileRepository {
  abstract getMe(): Promise<UserProfile>;
  abstract getById(id: string): Promise<UserProfile>;
  abstract updateMe(input: UpdateProfileInput): Promise<UserProfile>;

  abstract createExperience(
    input: WorkExperienceInput,
  ): Promise<WorkExperience>;
  abstract updateExperience(
    id: string,
    input: Partial<WorkExperienceInput>,
  ): Promise<WorkExperience>;
  abstract deleteExperience(id: string): Promise<void>;

  abstract createEducation(input: EducationInput): Promise<Education>;
  abstract updateEducation(
    id: string,
    input: Partial<EducationInput>,
  ): Promise<Education>;
  abstract deleteEducation(id: string): Promise<void>;

  abstract createLanguage(
    languageId: string,
    proficiency: LanguageProficiency,
  ): Promise<UserLanguage>;
  abstract updateLanguage(
    id: string,
    proficiency: LanguageProficiency,
  ): Promise<UserLanguage>;
  abstract deleteLanguage(id: string): Promise<void>;

  abstract addSkill(input: { skillId?: string; name?: string }): Promise<Skill>;
  abstract removeSkill(skillId: string): Promise<void>;

  abstract searchLanguages(
    q: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedLanguages>;
  abstract searchSkills(
    q: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedSkills>;

  abstract searchUsers(
    q: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedUserSearch>;
}
