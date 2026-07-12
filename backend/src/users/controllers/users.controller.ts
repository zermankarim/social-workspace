import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
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
import { SkillResponseDto } from '../dto/skill.dto';
import { CatalogSearchQueryDto } from '../dto/catalog-search-query.dto';
import {
  PaginatedLanguagesResponseDto,
  PaginatedSkillsResponseDto,
} from '../dto/paginated-catalog-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile (private)' })
  @ApiOkResponse({ type: PrivateUserProfileResponseDto })
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  getMe(
    @Req() req: RequestWithJwtPayload,
  ): Promise<PrivateUserProfileResponseDto> {
    return this.usersService.getMyProfile(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user profile fields',
    description:
      'Updates headline, cover, avatar, locale, bio, names and social links.',
  })
  @ApiOkResponse({ type: PrivateUserProfileResponseDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  updateMe(
    @Req() req: RequestWithJwtPayload,
    @Body() body: UpdateProfileDto,
  ): Promise<PrivateUserProfileResponseDto> {
    return this.usersService.updateMyProfile(req.user.userId, body);
  }

  // --- Experiences ---

  @Get(':userId/experiences')
  @ApiOperation({ summary: 'List work experiences for a user' })
  @ApiOkResponse({ type: [WorkExperienceResponseDto] })
  listExperiences(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<WorkExperienceResponseDto[]> {
    return this.usersService.listExperiences(userId);
  }

  @Post('me/experiences')
  @ApiOperation({ summary: 'Add work experience' })
  @ApiOkResponse({ type: WorkExperienceResponseDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createExperience(
    @Req() req: RequestWithJwtPayload,
    @Body() body: CreateWorkExperienceDto,
  ): Promise<WorkExperienceResponseDto> {
    return this.usersService.createExperience(req.user.userId, body);
  }

  @Patch('me/experiences/:id')
  @ApiOperation({ summary: 'Update own work experience' })
  @ApiOkResponse({ type: WorkExperienceResponseDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  updateExperience(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateWorkExperienceDto,
  ): Promise<WorkExperienceResponseDto> {
    return this.usersService.updateExperience(req.user.userId, id, body);
  }

  @Delete('me/experiences/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete own work experience' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  deleteExperience(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.usersService.deleteExperience(req.user.userId, id);
  }

  // --- Educations ---

  @Get(':userId/educations')
  @ApiOperation({ summary: 'List educations for a user' })
  @ApiOkResponse({ type: [EducationResponseDto] })
  listEducations(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<EducationResponseDto[]> {
    return this.usersService.listEducations(userId);
  }

  @Post('me/educations')
  @ApiOperation({ summary: 'Add education' })
  @ApiOkResponse({ type: EducationResponseDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createEducation(
    @Req() req: RequestWithJwtPayload,
    @Body() body: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.usersService.createEducation(req.user.userId, body);
  }

  @Patch('me/educations/:id')
  @ApiOperation({ summary: 'Update own education' })
  @ApiOkResponse({ type: EducationResponseDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  updateEducation(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.usersService.updateEducation(req.user.userId, id, body);
  }

  @Delete('me/educations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete own education' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  deleteEducation(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.usersService.deleteEducation(req.user.userId, id);
  }

  // --- Languages on profile ---

  @Get(':userId/languages')
  @ApiOperation({ summary: 'List languages on a user profile' })
  @ApiOkResponse({ type: [UserLanguageResponseDto] })
  listUserLanguages(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserLanguageResponseDto[]> {
    return this.usersService.listUserLanguages(userId);
  }

  @Post('me/languages')
  @ApiOperation({ summary: 'Add language to profile' })
  @ApiOkResponse({ type: UserLanguageResponseDto })
  @ApiConflictResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createUserLanguage(
    @Req() req: RequestWithJwtPayload,
    @Body() body: CreateUserLanguageDto,
  ): Promise<UserLanguageResponseDto> {
    return this.usersService.createUserLanguage(req.user.userId, body);
  }

  @Patch('me/languages/:id')
  @ApiOperation({ summary: 'Update language proficiency' })
  @ApiOkResponse({ type: UserLanguageResponseDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  updateUserLanguage(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserLanguageDto,
  ): Promise<UserLanguageResponseDto> {
    return this.usersService.updateUserLanguage(req.user.userId, id, body);
  }

  @Delete('me/languages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove language from profile' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  deleteUserLanguage(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.usersService.deleteUserLanguage(req.user.userId, id);
  }

  // --- Skills on profile ---

  @Get(':userId/skills')
  @ApiOperation({ summary: 'List skills on a user profile' })
  @ApiOkResponse({ type: [SkillResponseDto] })
  listUserSkills(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<SkillResponseDto[]> {
    return this.usersService.listUserSkills(userId);
  }

  @Post('me/skills')
  @ApiOperation({
    summary: 'Add skill to profile',
    description:
      'Pass skillId or name. Unknown names are created in the shared catalog.',
  })
  @ApiOkResponse({ type: SkillResponseDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  addUserSkill(
    @Req() req: RequestWithJwtPayload,
    @Body() body: AddUserSkillDto,
  ): Promise<SkillResponseDto> {
    return this.usersService.addUserSkill(req.user.userId, body);
  }

  @Delete('me/skills/:skillId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove skill from profile' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  removeUserSkill(
    @Req() req: RequestWithJwtPayload,
    @Param('skillId', ParseUUIDPipe) skillId: string,
  ): Promise<void> {
    return this.usersService.removeUserSkill(req.user.userId, skillId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public user profile by id' })
  @ApiOkResponse({ type: PublicUserProfileResponseDto })
  @ApiNotFoundResponse()
  getPublicProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PublicUserProfileResponseDto> {
    return this.usersService.getPublicProfile(id);
  }
}

@ApiTags('Catalog')
@Controller()
export class CatalogController {
  constructor(private readonly usersService: UsersService) {}

  @Get('languages')
  @ApiOperation({
    summary: 'Search languages catalog',
    description: 'Search by English/Russian name or ISO code.',
  })
  @ApiOkResponse({ type: PaginatedLanguagesResponseDto })
  searchLanguages(
    @Query() query: CatalogSearchQueryDto,
  ): Promise<PaginatedResponseDto<LanguageResponseDto>> {
    return this.usersService.searchLanguages(query);
  }

  @Get('skills')
  @ApiOperation({ summary: 'Search skills catalog' })
  @ApiOkResponse({ type: PaginatedSkillsResponseDto })
  searchSkills(
    @Query() query: CatalogSearchQueryDto,
  ): Promise<PaginatedResponseDto<SkillResponseDto>> {
    return this.usersService.searchSkills(query);
  }

  @Post('skills')
  @ApiOperation({
    summary: 'Create skill in catalog (or return existing)',
    description: 'Idempotent by case-insensitive name.',
  })
  @ApiOkResponse({ type: SkillResponseDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createSkill(@Body() body: CreateSkillDto): Promise<SkillResponseDto> {
    return this.usersService.createSkill(body);
  }
}
