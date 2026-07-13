import {
  PrivateUserProfileResponseDto,
  PublicUserProfileResponseDto,
  UserResponseDto,
} from '../dto/user.dto';
import {
  UserProfileSelected,
  UserPublic,
  UserSearchSelected,
  SkillSelected,
  WorkExperienceSelected,
  EducationSelected,
  UserLanguageSelected,
  LanguageSelected,
} from '../user.select';
import { LocationMapper } from './location.mapper';
import { SkillResponseDto } from '../dto/skill.dto';
import { WorkExperienceResponseDto } from '../dto/work-experience.dto';
import { EducationResponseDto } from '../dto/education.dto';
import {
  LanguageResponseDto,
  UserLanguageResponseDto,
} from '../dto/user-language.dto';
import { UserSearchResultDto } from '../dto/user-search-result.dto';

export class UserMapper {
  static fromPrismaToResponse(user: UserPublic): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      bio: user.bio,
      location: user.location
        ? LocationMapper.fromPrismaToResponse(user.location)
        : null,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      preferredLocale: user.preferredLocale,
      github: user.github,
      linkedin: user.linkedin,
      website: user.website,
      twitter: user.twitter,
    };
  }

  static toPublicProfile(
    user: UserProfileSelected,
    connectionsCount: number,
  ): PublicUserProfileResponseDto {
    return {
      id: user.id,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      bio: user.bio,
      location: user.location
        ? LocationMapper.fromPrismaToResponse(user.location)
        : null,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      preferredLocale: user.preferredLocale,
      github: user.github,
      linkedin: user.linkedin,
      website: user.website,
      twitter: user.twitter,
      experiences: user.experiences.map((item) =>
        this.toWorkExperienceResponse(item),
      ),
      educations: user.educations.map((item) => this.toEducationResponse(item)),
      languages: user.languages.map((item) =>
        this.toUserLanguageResponse(item),
      ),
      skills: user.skills.map((item) => this.toSkillResponse(item.skill)),
      connectionsCount,
    };
  }

  static toUserSearchResult(user: UserSearchSelected): UserSearchResultDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      avatarUrl: user.avatarUrl,
    };
  }

  static toPrivateProfile(
    user: UserProfileSelected,
    connectionsCount: number,
  ): PrivateUserProfileResponseDto {
    return {
      ...this.toPublicProfile(user, connectionsCount),
      email: user.email,
    };
  }

  static toSkillResponse(skill: SkillSelected): SkillResponseDto {
    return {
      id: skill.id,
      name: skill.name,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }

  static toLanguageResponse(language: LanguageSelected): LanguageResponseDto {
    return {
      id: language.id,
      code: language.code,
      nameEn: language.nameEn,
      nameRu: language.nameRu,
    };
  }

  static toWorkExperienceResponse(
    experience: WorkExperienceSelected,
  ): WorkExperienceResponseDto {
    return { ...experience };
  }

  static toEducationResponse(
    education: EducationSelected,
  ): EducationResponseDto {
    return {
      id: education.id,
      userId: education.userId,
      schoolName: education.schoolName,
      degree: education.degree,
      startDate: education.startDate,
      endDate: education.endDate,
      description: education.description,
      gradePoint: education.gradePoint,
      skills: education.skills.map((item) => this.toSkillResponse(item.skill)),
      createdAt: education.createdAt,
      updatedAt: education.updatedAt,
    };
  }

  static toUserLanguageResponse(
    userLanguage: UserLanguageSelected,
  ): UserLanguageResponseDto {
    return {
      id: userLanguage.id,
      userId: userLanguage.userId,
      language: this.toLanguageResponse(userLanguage.language),
      proficiency: userLanguage.proficiency,
      createdAt: userLanguage.createdAt,
      updatedAt: userLanguage.updatedAt,
    };
  }
}
