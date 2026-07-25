import type {
  PaginatedLanguages,
  PaginatedSkills,
} from "@/core/domain/entities/paginated-catalog.entity";
import type { PaginatedUserSearch } from "@/core/domain/entities/paginated-user-search.entity";
import type { Skill } from "@/core/domain/entities/skill.entity";
import type { SkillEndorser } from "@/core/domain/entities/skill-endorser.entity";
import type { UserLanguage } from "@/core/domain/entities/user-language.entity";
import type { UserProfile } from "@/core/domain/entities/user-profile.entity";
import type { WorkExperience } from "@/core/domain/entities/work-experience.entity";
import type { Education } from "@/core/domain/entities/education.entity";
import type { LanguageProficiency } from "@/core/domain/enums/language-proficiency.enum";
import type {
  EducationInput,
  ProfileRepository,
  UpdateProfileInput,
  WorkExperienceInput,
} from "@/core/domain/repositories/profile.repository";

export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  getMe(): Promise<UserProfile> {
    return this.profileRepository.getMe();
  }

  getById(id: string): Promise<UserProfile> {
    return this.profileRepository.getById(id);
  }

  updateMe(input: UpdateProfileInput): Promise<UserProfile> {
    return this.profileRepository.updateMe(input);
  }

  createExperience(input: WorkExperienceInput): Promise<WorkExperience> {
    return this.profileRepository.createExperience(input);
  }

  updateExperience(
    id: string,
    input: Partial<WorkExperienceInput>,
  ): Promise<WorkExperience> {
    return this.profileRepository.updateExperience(id, input);
  }

  deleteExperience(id: string): Promise<void> {
    return this.profileRepository.deleteExperience(id);
  }

  createEducation(input: EducationInput): Promise<Education> {
    return this.profileRepository.createEducation(input);
  }

  updateEducation(
    id: string,
    input: Partial<EducationInput>,
  ): Promise<Education> {
    return this.profileRepository.updateEducation(id, input);
  }

  deleteEducation(id: string): Promise<void> {
    return this.profileRepository.deleteEducation(id);
  }

  createLanguage(
    languageId: string,
    proficiency: LanguageProficiency,
  ): Promise<UserLanguage> {
    return this.profileRepository.createLanguage(languageId, proficiency);
  }

  updateLanguage(
    id: string,
    proficiency: LanguageProficiency,
  ): Promise<UserLanguage> {
    return this.profileRepository.updateLanguage(id, proficiency);
  }

  deleteLanguage(id: string): Promise<void> {
    return this.profileRepository.deleteLanguage(id);
  }

  addSkill(input: { skillId?: string; name?: string }): Promise<Skill> {
    return this.profileRepository.addSkill(input);
  }

  removeSkill(skillId: string): Promise<void> {
    return this.profileRepository.removeSkill(skillId);
  }

  listSkillEndorsers(
    userId: string,
    skillId: string,
  ): Promise<SkillEndorser[]> {
    return this.profileRepository.listSkillEndorsers(userId, skillId);
  }

  endorseSkill(userId: string, skillId: string): Promise<void> {
    return this.profileRepository.endorseSkill(userId, skillId);
  }

  removeSkillEndorsement(userId: string, skillId: string): Promise<void> {
    return this.profileRepository.removeSkillEndorsement(userId, skillId);
  }

  /**
   * Persist a draft skill list against the current profile skills.
   * Backend only supports per-skill add/remove, so this applies a diff.
   */
  async syncSkills(
    current: Skill[],
    next: ReadonlyArray<{ skillId?: string; name: string }>,
  ): Promise<void> {
    const matches = (
      existing: Skill,
      draft: { skillId?: string; name: string },
    ) =>
      (draft.skillId != null && draft.skillId === existing.id) ||
      draft.name.toLowerCase() === existing.name.toLowerCase();

    const toRemove = current.filter(
      (skill) => !next.some((draft) => matches(skill, draft)),
    );
    const toAdd = next.filter(
      (draft) => !current.some((skill) => matches(skill, draft)),
    );

    await Promise.all([
      ...toRemove.map((skill) => this.profileRepository.removeSkill(skill.id)),
      ...toAdd.map((draft) =>
        this.profileRepository.addSkill(
          draft.skillId ? { skillId: draft.skillId } : { name: draft.name },
        ),
      ),
    ]);
  }

  searchLanguages(
    q: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedLanguages> {
    return this.profileRepository.searchLanguages(q, page, limit);
  }

  searchSkills(q: string, page = 1, limit = 20): Promise<PaginatedSkills> {
    return this.profileRepository.searchSkills(q, page, limit);
  }

  searchUsers(q: string, page = 1, limit = 20): Promise<PaginatedUserSearch> {
    return this.profileRepository.searchUsers(q, page, limit);
  }
}
