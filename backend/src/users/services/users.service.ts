import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersRepository } from '../repositories/users.repository';
import { UserMapper } from '../mappers/user.mapper';
import {
  PrivateUserProfileResponseDto,
  PublicUserProfileResponseDto,
} from '../dto/user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import {
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto,
} from '../dto/create-work-experience.dto';
import { WorkExperienceResponseDto } from '../dto/work-experience.dto';
import {
  CreateEducationDto,
  UpdateEducationDto,
} from '../dto/create-education.dto';
import { EducationResponseDto } from '../dto/education.dto';
import {
  CreateUserLanguageDto,
  UpdateUserLanguageDto,
} from '../dto/create-user-language.dto';
import {
  LanguageResponseDto,
  UserLanguageResponseDto,
} from '../dto/user-language.dto';
import { AddUserSkillDto, CreateSkillDto } from '../dto/create-skill.dto';
import { SkillEndorserDto, SkillResponseDto } from '../dto/skill.dto';
import { CatalogSearchQueryDto } from '../dto/catalog-search-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { assertDateRange, normalizeSkillName } from '../utils/profile.utils';
import {
  EducationSelected,
  UserLanguageSelected,
  WorkExperienceSelected,
} from '../user.select';
import { ConnectionsService } from '../../connections/services/connections.service';
import { ConnectionResponseDto } from '../../connections/dto/connection.dto';
import { PaginatedConnectionsQueryDto } from '../../connections/dto/paginated-connections-query.dto';
import { UserSearchQueryDto } from '../dto/user-search-query.dto';
import { UserSearchResultDto } from '../dto/user-search-result.dto';
import { buildUserSearchWhere } from '../utils/user-search.utils';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { SKILL_ENDORSEMENT_RECEIVED_EVENT } from '../../gamification/events/gamification.events';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly connectionsService: ConnectionsService,
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getMyProfile(userId: string): Promise<PrivateUserProfileResponseDto> {
    const [user, connectionsCount] = await Promise.all([
      this.usersRepository.findProfileById(userId),
      this.connectionsService.countAcceptedByUserId(userId),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toPrivateProfile(user, connectionsCount);
  }

  async getPublicProfile(
    userId: string,
  ): Promise<PublicUserProfileResponseDto> {
    const [user, connectionsCount] = await Promise.all([
      this.usersRepository.findProfileById(userId),
      this.connectionsService.countAcceptedByUserId(userId),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toPublicProfile(user, connectionsCount);
  }

  async updateMyProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<PrivateUserProfileResponseDto> {
    const data: Prisma.UserUpdateInput = {
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName !== undefined && { lastName: dto.lastName }),
      ...(dto.headline !== undefined && { headline: dto.headline }),
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      ...(dto.coverUrl !== undefined && { coverUrl: dto.coverUrl }),
      ...(dto.preferredLocale !== undefined && {
        preferredLocale: dto.preferredLocale,
      }),
      ...(dto.website !== undefined && { website: dto.website }),
      ...(dto.github !== undefined && { github: dto.github }),
      ...(dto.linkedin !== undefined && { linkedin: dto.linkedin }),
      ...(dto.twitter !== undefined && { twitter: dto.twitter }),
    };

    const [user, connectionsCount] = await Promise.all([
      this.usersRepository.updateProfile(userId, data),
      this.connectionsService.countAcceptedByUserId(userId),
    ]);
    return UserMapper.toPrivateProfile(user, connectionsCount);
  }

  // --- Experiences ---

  listExperiences(userId: string): Promise<WorkExperienceResponseDto[]> {
    return this.usersRepository
      .findExperiencesByUserId(userId)
      .then((items) =>
        items.map((item) => UserMapper.toWorkExperienceResponse(item)),
      );
  }

  async createExperience(
    userId: string,
    dto: CreateWorkExperienceDto,
  ): Promise<WorkExperienceResponseDto> {
    assertDateRange(dto.startDate, dto.endDate);
    const created = await this.usersRepository.createExperience({
      user: { connect: { id: userId } },
      title: dto.title,
      employmentType: dto.employmentType,
      companyName: dto.companyName,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      workplaceType: dto.workplaceType,
      description: dto.description ?? null,
    });
    return UserMapper.toWorkExperienceResponse(created);
  }

  async updateExperience(
    userId: string,
    experienceId: string,
    dto: UpdateWorkExperienceDto,
  ): Promise<WorkExperienceResponseDto> {
    const experience = await this.getOwnedExperienceOrThrow(
      userId,
      experienceId,
    );
    const nextStart = dto.startDate ?? experience.startDate;
    const nextEnd =
      dto.endDate !== undefined ? dto.endDate : experience.endDate;
    assertDateRange(nextStart, nextEnd);

    const updated = await this.usersRepository.updateExperience(experienceId, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.employmentType !== undefined && {
        employmentType: dto.employmentType,
      }),
      ...(dto.companyName !== undefined && { companyName: dto.companyName }),
      ...(dto.startDate !== undefined && {
        startDate: new Date(dto.startDate),
      }),
      ...(dto.endDate !== undefined && {
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      }),
      ...(dto.workplaceType !== undefined && {
        workplaceType: dto.workplaceType,
      }),
      ...(dto.description !== undefined && { description: dto.description }),
    });
    return UserMapper.toWorkExperienceResponse(updated);
  }

  async deleteExperience(userId: string, experienceId: string): Promise<void> {
    await this.getOwnedExperienceOrThrow(userId, experienceId);
    await this.usersRepository.deleteExperience(experienceId);
  }

  // --- Educations ---

  listEducations(userId: string): Promise<EducationResponseDto[]> {
    return this.usersRepository
      .findEducationsByUserId(userId)
      .then((items) =>
        items.map((item) => UserMapper.toEducationResponse(item)),
      );
  }

  async createEducation(
    userId: string,
    dto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    assertDateRange(dto.startDate, dto.endDate);
    const skillIds = dto.skillNames?.length
      ? await this.usersRepository.resolveSkillIdsByNames(dto.skillNames)
      : [];

    const created = await this.usersRepository.createEducation({
      user: { connect: { id: userId } },
      schoolName: dto.schoolName,
      degree: dto.degree,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      description: dto.description ?? null,
      gradePoint: dto.gradePoint ?? null,
      skills: skillIds.length
        ? {
            create: skillIds.map((skillId) => ({
              skill: { connect: { id: skillId } },
            })),
          }
        : undefined,
    });
    return UserMapper.toEducationResponse(created);
  }

  async updateEducation(
    userId: string,
    educationId: string,
    dto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    const education = await this.getOwnedEducationOrThrow(userId, educationId);
    const nextStart = dto.startDate ?? education.startDate;
    const nextEnd = dto.endDate !== undefined ? dto.endDate : education.endDate;
    assertDateRange(nextStart, nextEnd);

    let skillsUpdate: Prisma.EducationUpdateInput['skills'];
    if (dto.skillNames !== undefined) {
      const skillIds = await this.usersRepository.resolveSkillIdsByNames(
        dto.skillNames,
      );
      skillsUpdate = {
        deleteMany: {},
        create: skillIds.map((skillId) => ({
          skill: { connect: { id: skillId } },
        })),
      };
    }

    const updated = await this.usersRepository.updateEducation(educationId, {
      ...(dto.schoolName !== undefined && { schoolName: dto.schoolName }),
      ...(dto.degree !== undefined && { degree: dto.degree }),
      ...(dto.startDate !== undefined && {
        startDate: new Date(dto.startDate),
      }),
      ...(dto.endDate !== undefined && {
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.gradePoint !== undefined && { gradePoint: dto.gradePoint }),
      ...(skillsUpdate !== undefined && { skills: skillsUpdate }),
    });
    return UserMapper.toEducationResponse(updated);
  }

  async deleteEducation(userId: string, educationId: string): Promise<void> {
    await this.getOwnedEducationOrThrow(userId, educationId);
    await this.usersRepository.deleteEducation(educationId);
  }

  // --- User languages ---

  listUserLanguages(userId: string): Promise<UserLanguageResponseDto[]> {
    return this.usersRepository
      .findUserLanguages(userId)
      .then((items) =>
        items.map((item) => UserMapper.toUserLanguageResponse(item)),
      );
  }

  async createUserLanguage(
    userId: string,
    dto: CreateUserLanguageDto,
  ): Promise<UserLanguageResponseDto> {
    const language = await this.usersRepository.findLanguageById(
      dto.languageId,
    );
    if (!language) {
      throw new NotFoundException('Language not found');
    }

    try {
      const created = await this.usersRepository.createUserLanguage({
        user: { connect: { id: userId } },
        language: { connect: { id: dto.languageId } },
        proficiency: dto.proficiency,
      });
      return UserMapper.toUserLanguageResponse(created);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Language already added to profile');
      }
      throw error;
    }
  }

  async updateUserLanguage(
    userId: string,
    userLanguageId: string,
    dto: UpdateUserLanguageDto,
  ): Promise<UserLanguageResponseDto> {
    await this.getOwnedUserLanguageOrThrow(userId, userLanguageId);
    const updated = await this.usersRepository.updateUserLanguage(
      userLanguageId,
      {
        ...(dto.proficiency !== undefined && {
          proficiency: dto.proficiency,
        }),
      },
    );
    return UserMapper.toUserLanguageResponse(updated);
  }

  async deleteUserLanguage(
    userId: string,
    userLanguageId: string,
  ): Promise<void> {
    await this.getOwnedUserLanguageOrThrow(userId, userLanguageId);
    await this.usersRepository.deleteUserLanguage(userLanguageId);
  }

  // --- Catalogs ---

  async searchUsers(
    query: UserSearchQueryDto,
  ): Promise<PaginatedResponseDto<UserSearchResultDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const q = query.q?.trim();
    if (!q) {
      return {
        data: [],
        meta: buildPaginationMeta(page, limit, 0),
      };
    }

    const where = buildUserSearchWhere(q);
    const [items, total] = await Promise.all([
      this.usersRepository.searchUsers(where, skip, take),
      this.usersRepository.countUsers(where),
    ]);

    return {
      data: items.map((item) => UserMapper.toUserSearchResult(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async searchLanguages(
    query: CatalogSearchQueryDto,
  ): Promise<PaginatedResponseDto<LanguageResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const q = query.q?.trim();
    const where: Prisma.LanguageWhereInput = q
      ? {
          OR: [
            { nameEn: { contains: q, mode: 'insensitive' } },
            { nameRu: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.usersRepository.findLanguages(where, skip, take),
      this.usersRepository.countLanguages(where),
    ]);

    return {
      data: items.map((item) => UserMapper.toLanguageResponse(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async searchSkills(
    query: CatalogSearchQueryDto,
  ): Promise<PaginatedResponseDto<SkillResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const q = query.q?.trim();
    const where: Prisma.SkillWhereInput = q
      ? { name: { contains: q, mode: 'insensitive' } }
      : {};

    const [items, total] = await Promise.all([
      this.usersRepository.findSkills(where, skip, take),
      this.usersRepository.countSkills(where),
    ]);

    return {
      data: items.map((item) => UserMapper.toSkillResponse(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async createSkill(dto: CreateSkillDto): Promise<SkillResponseDto> {
    const name = normalizeSkillName(dto.name);
    if (!name) {
      throw new BadRequestException('Skill name is required');
    }
    const skill = await this.usersRepository.findOrCreateSkillByName(name);
    return UserMapper.toSkillResponse(skill);
  }

  listUserSkills(userId: string): Promise<SkillResponseDto[]> {
    return this.usersRepository
      .findUserSkills(userId)
      .then((items) => items.map((item) => UserMapper.toSkillResponse(item)));
  }

  async addUserSkill(
    userId: string,
    dto: AddUserSkillDto,
  ): Promise<SkillResponseDto> {
    if (!dto.skillId && !dto.name) {
      throw new BadRequestException('Provide skillId or name');
    }

    let skillId = dto.skillId;
    if (!skillId && dto.name) {
      const name = normalizeSkillName(dto.name);
      if (!name) {
        throw new BadRequestException('Skill name is required');
      }
      skillId = (await this.usersRepository.findOrCreateSkillByName(name)).id;
    } else if (skillId) {
      const existing = await this.usersRepository.findSkillById(skillId);
      if (!existing) {
        throw new NotFoundException('Skill not found');
      }
    }

    const skill = await this.usersRepository.addUserSkill(userId, skillId!);
    return UserMapper.toSkillResponse(skill);
  }

  async removeUserSkill(userId: string, skillId: string): Promise<void> {
    const removed = await this.usersRepository.removeUserSkill(userId, skillId);
    if (!removed) {
      throw new NotFoundException('Skill not found on profile');
    }
  }

  async endorseSkill(
    endorserId: string,
    userId: string,
    skillId: string,
  ): Promise<void> {
    if (endorserId === userId) {
      throw new BadRequestException('Cannot endorse your own skill');
    }
    const hasSkill = await this.usersRepository.hasUserSkill(userId, skillId);
    if (!hasSkill) {
      throw new NotFoundException('Skill not found on that profile');
    }

    const { created } = await this.usersRepository.endorseSkill(
      userId,
      skillId,
      endorserId,
    );
    if (created) {
      await this.notificationsService.notifySkillEndorsed(endorserId, userId);
      this.eventEmitter.emit(SKILL_ENDORSEMENT_RECEIVED_EVENT, {
        recipientId: userId,
        endorserId,
      });
    }
  }

  async removeSkillEndorsement(
    endorserId: string,
    userId: string,
    skillId: string,
  ): Promise<void> {
    const removed = await this.usersRepository.removeSkillEndorsement(
      userId,
      skillId,
      endorserId,
    );
    if (!removed) {
      throw new NotFoundException('Endorsement not found');
    }
  }

  listSkillEndorsers(
    userId: string,
    skillId: string,
  ): Promise<SkillEndorserDto[]> {
    return this.usersRepository
      .listSkillEndorsers(userId, skillId)
      .then((rows) =>
        rows.map((row) => UserMapper.toSkillEndorserResponse(row)),
      );
  }

  listConnections(
    userId: string,
    query: PaginatedConnectionsQueryDto,
  ): Promise<PaginatedResponseDto<ConnectionResponseDto>> {
    return this.connectionsService.getAcceptedByUserId(userId, query);
  }

  private async getOwnedExperienceOrThrow(
    userId: string,
    experienceId: string,
  ): Promise<WorkExperienceSelected> {
    const experience =
      await this.usersRepository.findExperienceById(experienceId);
    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }
    if (experience.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this experience');
    }
    return experience;
  }

  private async getOwnedEducationOrThrow(
    userId: string,
    educationId: string,
  ): Promise<EducationSelected> {
    const education = await this.usersRepository.findEducationById(educationId);
    if (!education) {
      throw new NotFoundException('Education not found');
    }
    if (education.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this education');
    }
    return education;
  }

  private async getOwnedUserLanguageOrThrow(
    userId: string,
    userLanguageId: string,
  ): Promise<UserLanguageSelected> {
    const item =
      await this.usersRepository.findUserLanguageById(userLanguageId);
    if (!item) {
      throw new NotFoundException('User language not found');
    }
    if (item.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this language');
    }
    return item;
  }
}
