import type { EducationDegree } from "@/core/domain/enums/education-degree.enum";
import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { LanguageProficiency } from "@/core/domain/enums/language-proficiency.enum";
import type { PreferredLocale } from "@/core/domain/enums/preferred-locale.enum";
import type { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";
import type { LocationResponseDto } from "@/infrastructure/api/dto/auth-response.dto";
import type { PaginationMetaResponseDto } from "@/infrastructure/api/dto/pagination-response.dto";

export interface SkillResponseDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  endorsementsCount: number;
}

export interface SkillEndorserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
}

export interface LanguageResponseDto {
  id: string;
  code: string;
  nameEn: string;
  nameRu: string;
}

export interface UserLanguageResponseDto {
  id: string;
  userId: string;
  language: LanguageResponseDto;
  proficiency: LanguageProficiency;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperienceResponseDto {
  id: string;
  userId: string;
  title: string;
  employmentType: EmploymentType;
  companyName: string;
  startDate: string;
  endDate: string | null;
  workplaceType: WorkplaceType;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EducationResponseDto {
  id: string;
  userId: string;
  schoolName: string;
  degree: EducationDegree;
  startDate: string;
  endDate: string | null;
  description: string | null;
  gradePoint: number | null;
  skills: SkillResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicUserProfileResponseDto {
  id: string;
  role: ProfileRole;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  bio: string | null;
  location: LocationResponseDto | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  preferredLocale: PreferredLocale;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  twitter: string | null;
  experiences: WorkExperienceResponseDto[];
  educations: EducationResponseDto[];
  languages: UserLanguageResponseDto[];
  skills: SkillResponseDto[];
  connectionsCount: number;
}

export interface PrivateUserProfileResponseDto extends PublicUserProfileResponseDto {
  email: string;
}

export interface PaginatedLanguagesResponseDto {
  data: LanguageResponseDto[];
  meta: PaginationMetaResponseDto;
}

export interface PaginatedSkillsResponseDto {
  data: SkillResponseDto[];
  meta: PaginationMetaResponseDto;
}

export interface UserSearchResultResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  avatarUrl: string | null;
}

export interface PaginatedUserSearchResponseDto {
  data: UserSearchResultResponseDto[];
  meta: PaginationMetaResponseDto;
}
