import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPublic } from '../../users/user.select';

export class PostAuthorDto implements Pick<
  UserPublic,
  'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'bio'
> {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({
    example: 'http://localhost:8000/files/avatar.png',
    nullable: true,
    format: 'uri',
  })
  avatarUrl: string | null;

  @ApiPropertyOptional({
    example: 'Software engineer',
    nullable: true,
  })
  bio: string | null;
}
