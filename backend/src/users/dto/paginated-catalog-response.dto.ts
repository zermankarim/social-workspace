import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { SkillResponseDto } from './skill.dto';
import { LanguageResponseDto } from './user-language.dto';

export const PaginatedSkillsResponseDto = createPaginatedResponseDto(
  SkillResponseDto,
  'Skills for the current page',
);

export const PaginatedLanguagesResponseDto = createPaginatedResponseDto(
  LanguageResponseDto,
  'Languages for the current page',
);
