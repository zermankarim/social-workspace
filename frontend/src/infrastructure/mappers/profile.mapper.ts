import { Education } from "@/core/domain/entities/education.entity";
import { Language } from "@/core/domain/entities/language.entity";
import { Skill } from "@/core/domain/entities/skill.entity";
import { UserLanguage } from "@/core/domain/entities/user-language.entity";
import { UserProfile } from "@/core/domain/entities/user-profile.entity";
import { WorkExperience } from "@/core/domain/entities/work-experience.entity";
import { PreferredLocale } from "@/core/domain/enums/preferred-locale.enum";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import type {
  EducationResponseDto,
  LanguageResponseDto,
  PrivateUserProfileResponseDto,
  PublicUserProfileResponseDto,
  SkillResponseDto,
  UserLanguageResponseDto,
  WorkExperienceResponseDto,
} from "@/infrastructure/api/dto/profile-response.dto";
import { LocationMapper } from "@/infrastructure/mappers/location.mapper";

function parseLocale(value: string): PreferredLocale {
  return value === PreferredLocale.RU ? PreferredLocale.RU : PreferredLocale.EN;
}

export class ProfileMapper {
  static skillFromApi(dto: SkillResponseDto): Skill {
    return new Skill(
      dto.id,
      dto.name,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static languageFromApi(dto: LanguageResponseDto): Language {
    return new Language(dto.id, dto.code, dto.nameEn, dto.nameRu);
  }

  static userLanguageFromApi(dto: UserLanguageResponseDto): UserLanguage {
    return new UserLanguage(
      dto.id,
      dto.userId,
      this.languageFromApi(dto.language),
      dto.proficiency,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static experienceFromApi(dto: WorkExperienceResponseDto): WorkExperience {
    return new WorkExperience(
      dto.id,
      dto.userId,
      dto.title,
      dto.employmentType,
      dto.companyName,
      new Date(dto.startDate),
      dto.endDate ? new Date(dto.endDate) : null,
      dto.workplaceType,
      dto.description,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static educationFromApi(dto: EducationResponseDto): Education {
    return new Education(
      dto.id,
      dto.userId,
      dto.schoolName,
      dto.degree,
      new Date(dto.startDate),
      dto.endDate ? new Date(dto.endDate) : null,
      dto.description,
      dto.gradePoint,
      dto.skills.map((skill) => this.skillFromApi(skill)),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static profileFromApi(
    dto: PublicUserProfileResponseDto | PrivateUserProfileResponseDto,
  ): UserProfile {
    const email = "email" in dto ? dto.email : null;

    return new UserProfile(
      dto.id,
      email,
      dto.role as ProfileRole,
      dto.firstName,
      dto.lastName,
      dto.headline,
      dto.bio,
      dto.location ? LocationMapper.fromApi(dto.location) : null,
      dto.avatarUrl,
      dto.coverUrl,
      parseLocale(dto.preferredLocale),
      dto.github,
      dto.linkedin,
      dto.website,
      dto.twitter,
      dto.experiences.map((item) => this.experienceFromApi(item)),
      dto.educations.map((item) => this.educationFromApi(item)),
      dto.languages.map((item) => this.userLanguageFromApi(item)),
      dto.skills.map((item) => this.skillFromApi(item)),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }
}
