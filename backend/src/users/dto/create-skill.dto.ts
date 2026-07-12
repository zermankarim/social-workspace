import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { SKILL_NAME_MAX_LENGTH } from '../constants/profile.constants';

export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @MaxLength(SKILL_NAME_MAX_LENGTH)
  name: string;
}

export class AddUserSkillDto {
  @ApiPropertyOptional({
    description: 'Existing skill id. Provide skillId or name.',
  })
  @IsOptional()
  @IsUUID()
  skillId?: string;

  @ApiPropertyOptional({
    example: 'TypeScript',
    description:
      'Skill name. Creates the skill in the catalog if it does not exist.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(SKILL_NAME_MAX_LENGTH)
  name?: string;
}
