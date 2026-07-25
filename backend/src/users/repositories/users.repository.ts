import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  educationSelect,
  EducationSelected,
  languageSelect,
  LanguageSelected,
  skillSelect,
  SkillSelected,
  SkillEndorserSelected,
  userLanguageSelect,
  UserLanguageSelected,
  userProfileSelect,
  UserProfileSelected,
  userPublicSelect,
  UserPublic,
  userSearchSelect,
  UserSearchSelected,
  workExperienceSelect,
  WorkExperienceSelected,
} from '../user.select';
import { normalizeSkillName } from '../utils/profile.utils';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPublicById(id: string): Promise<UserPublic | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  searchUsers(
    where: Prisma.UserWhereInput,
    skip: number,
    take: number,
  ): Promise<UserSearchSelected[]> {
    return this.prisma.user.findMany({
      where,
      select: userSearchSelect,
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      skip,
      take,
    });
  }

  countUsers(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  findProfileById(id: string): Promise<UserProfileSelected | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userProfileSelect,
    });
  }

  updateProfile(
    userId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserProfileSelected> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: userProfileSelect,
    });
  }

  // --- Experiences ---

  findExperiencesByUserId(userId: string): Promise<WorkExperienceSelected[]> {
    return this.prisma.workExperience.findMany({
      where: { userId },
      select: workExperienceSelect,
      orderBy: { startDate: 'desc' },
    });
  }

  findExperienceById(id: string): Promise<WorkExperienceSelected | null> {
    return this.prisma.workExperience.findUnique({
      where: { id },
      select: workExperienceSelect,
    });
  }

  createExperience(
    data: Prisma.WorkExperienceCreateInput,
  ): Promise<WorkExperienceSelected> {
    return this.prisma.workExperience.create({
      data,
      select: workExperienceSelect,
    });
  }

  updateExperience(
    id: string,
    data: Prisma.WorkExperienceUpdateInput,
  ): Promise<WorkExperienceSelected> {
    return this.prisma.workExperience.update({
      where: { id },
      data,
      select: workExperienceSelect,
    });
  }

  deleteExperience(id: string): Promise<void> {
    return this.prisma.workExperience
      .delete({ where: { id } })
      .then(() => undefined);
  }

  // --- Educations ---

  findEducationsByUserId(userId: string): Promise<EducationSelected[]> {
    return this.prisma.education.findMany({
      where: { userId },
      select: educationSelect,
      orderBy: { startDate: 'desc' },
    });
  }

  findEducationById(id: string): Promise<EducationSelected | null> {
    return this.prisma.education.findUnique({
      where: { id },
      select: educationSelect,
    });
  }

  createEducation(
    data: Prisma.EducationCreateInput,
  ): Promise<EducationSelected> {
    return this.prisma.education.create({
      data,
      select: educationSelect,
    });
  }

  updateEducation(
    id: string,
    data: Prisma.EducationUpdateInput,
  ): Promise<EducationSelected> {
    return this.prisma.education.update({
      where: { id },
      data,
      select: educationSelect,
    });
  }

  deleteEducation(id: string): Promise<void> {
    return this.prisma.education
      .delete({ where: { id } })
      .then(() => undefined);
  }

  // --- Languages catalog + user languages ---

  findLanguages(
    where: Prisma.LanguageWhereInput,
    skip: number,
    take: number,
  ): Promise<LanguageSelected[]> {
    return this.prisma.language.findMany({
      where,
      select: languageSelect,
      orderBy: { nameEn: 'asc' },
      skip,
      take,
    });
  }

  countLanguages(where: Prisma.LanguageWhereInput): Promise<number> {
    return this.prisma.language.count({ where });
  }

  findLanguageById(id: string): Promise<LanguageSelected | null> {
    return this.prisma.language.findUnique({
      where: { id },
      select: languageSelect,
    });
  }

  findUserLanguages(userId: string): Promise<UserLanguageSelected[]> {
    return this.prisma.userLanguage.findMany({
      where: { userId },
      select: userLanguageSelect,
      orderBy: { createdAt: 'asc' },
    });
  }

  findUserLanguageById(id: string): Promise<UserLanguageSelected | null> {
    return this.prisma.userLanguage.findUnique({
      where: { id },
      select: userLanguageSelect,
    });
  }

  createUserLanguage(
    data: Prisma.UserLanguageCreateInput,
  ): Promise<UserLanguageSelected> {
    return this.prisma.userLanguage.create({
      data,
      select: userLanguageSelect,
    });
  }

  updateUserLanguage(
    id: string,
    data: Prisma.UserLanguageUpdateInput,
  ): Promise<UserLanguageSelected> {
    return this.prisma.userLanguage.update({
      where: { id },
      data,
      select: userLanguageSelect,
    });
  }

  deleteUserLanguage(id: string): Promise<void> {
    return this.prisma.userLanguage
      .delete({ where: { id } })
      .then(() => undefined);
  }

  // --- Skills catalog + user skills ---

  findSkills(
    where: Prisma.SkillWhereInput,
    skip: number,
    take: number,
  ): Promise<SkillSelected[]> {
    return this.prisma.skill.findMany({
      where,
      select: skillSelect,
      orderBy: { name: 'asc' },
      skip,
      take,
    });
  }

  countSkills(where: Prisma.SkillWhereInput): Promise<number> {
    return this.prisma.skill.count({ where });
  }

  findSkillById(id: string): Promise<SkillSelected | null> {
    return this.prisma.skill.findUnique({
      where: { id },
      select: skillSelect,
    });
  }

  findSkillByNameInsensitive(name: string): Promise<SkillSelected | null> {
    return this.prisma.skill.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
      select: skillSelect,
    });
  }

  createSkill(name: string): Promise<SkillSelected> {
    return this.prisma.skill.create({
      data: { name },
      select: skillSelect,
    });
  }

  async findOrCreateSkillByName(rawName: string): Promise<SkillSelected> {
    const name = normalizeSkillName(rawName);
    if (!name) {
      throw new Error('Skill name is empty');
    }
    const existing = await this.findSkillByNameInsensitive(name);
    if (existing) {
      return existing;
    }
    try {
      return await this.createSkill(name);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const raced = await this.findSkillByNameInsensitive(name);
        if (raced) {
          return raced;
        }
      }
      throw error;
    }
  }

  async resolveSkillIdsByNames(names: string[]): Promise<string[]> {
    const uniqueNames = [
      ...new Set(names.map(normalizeSkillName).filter(Boolean)),
    ];
    const skills = await Promise.all(
      uniqueNames.map((name) => this.findOrCreateSkillByName(name)),
    );
    return skills.map((skill) => skill.id);
  }

  async findUserSkills(
    userId: string,
  ): Promise<Array<SkillSelected & { endorsementsCount: number }>> {
    const rows = await this.prisma.userSkill.findMany({
      where: { userId },
      select: {
        skill: { select: skillSelect },
        _count: { select: { endorsements: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => ({
      ...row.skill,
      endorsementsCount: row._count.endorsements,
    }));
  }

  // --- Skill endorsements ---

  async hasUserSkill(userId: string, skillId: string): Promise<boolean> {
    const row = await this.prisma.userSkill.findUnique({
      where: { userId_skillId: { userId, skillId } },
      select: { userId: true },
    });
    return row !== null;
  }

  async endorseSkill(
    userId: string,
    skillId: string,
    endorserId: string,
  ): Promise<{ created: boolean }> {
    const existing = await this.prisma.skillEndorsement.findUnique({
      where: {
        userId_skillId_endorserId: { userId, skillId, endorserId },
      },
      select: { id: true },
    });
    if (existing) return { created: false };

    await this.prisma.skillEndorsement.create({
      data: { userId, skillId, endorserId },
    });
    return { created: true };
  }

  async removeSkillEndorsement(
    userId: string,
    skillId: string,
    endorserId: string,
  ): Promise<boolean> {
    const result = await this.prisma.skillEndorsement.deleteMany({
      where: { userId, skillId, endorserId },
    });
    return result.count > 0;
  }

  async listSkillEndorsers(
    userId: string,
    skillId: string,
  ): Promise<SkillEndorserSelected[]> {
    const rows = await this.prisma.skillEndorsement.findMany({
      where: { userId, skillId },
      select: {
        endorser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            headline: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => row.endorser);
  }

  async addUserSkill(userId: string, skillId: string): Promise<SkillSelected> {
    await this.prisma.userSkill.upsert({
      where: {
        userId_skillId: { userId, skillId },
      },
      create: { userId, skillId },
      update: {},
    });
    const skill = await this.findSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found after attach');
    }
    return skill;
  }

  async removeUserSkill(userId: string, skillId: string): Promise<boolean> {
    try {
      await this.prisma.userSkill.delete({
        where: { userId_skillId: { userId, skillId } },
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return false;
      }
      throw error;
    }
  }
}
