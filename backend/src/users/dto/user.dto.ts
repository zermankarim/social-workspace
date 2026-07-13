import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PreferredLocale, ProfileRole } from '@prisma/client';
import { LocationResponseDto } from './location.dto';
import { WorkExperienceResponseDto } from './work-experience.dto';
import { EducationResponseDto } from './education.dto';
import { UserLanguageResponseDto } from './user-language.dto';
import { SkillResponseDto } from './skill.dto';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: ProfileRole })
  role: ProfileRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiProperty()
  bio: string | null;

  @ApiProperty({ type: LocationResponseDto, nullable: true })
  location: LocationResponseDto | null;

  @ApiProperty({ format: 'uri', nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  coverUrl: string | null;

  @ApiProperty({ enum: PreferredLocale })
  preferredLocale: PreferredLocale;

  @ApiProperty({ format: 'uri', nullable: true })
  github: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  linkedin: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  website: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  twitter: string | null;
}

export class PublicUserProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ProfileRole })
  role: ProfileRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiProperty({ nullable: true })
  bio: string | null;

  @ApiProperty({ type: LocationResponseDto, nullable: true })
  location: LocationResponseDto | null;

  @ApiProperty({ format: 'uri', nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  coverUrl: string | null;

  @ApiProperty({ enum: PreferredLocale })
  preferredLocale: PreferredLocale;

  @ApiProperty({ format: 'uri', nullable: true })
  github: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  linkedin: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  website: string | null;

  @ApiProperty({ format: 'uri', nullable: true })
  twitter: string | null;

  @ApiProperty({ type: [WorkExperienceResponseDto] })
  experiences: WorkExperienceResponseDto[];

  @ApiProperty({ type: [EducationResponseDto] })
  educations: EducationResponseDto[];

  @ApiProperty({ type: [UserLanguageResponseDto] })
  languages: UserLanguageResponseDto[];

  @ApiProperty({ type: [SkillResponseDto] })
  skills: SkillResponseDto[];

  @ApiProperty({ type: Number })
  connectionsCount: number;
}

export class PrivateUserProfileResponseDto extends PublicUserProfileResponseDto {
  @ApiProperty()
  email: string;
}
