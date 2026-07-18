import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class RegisterImpressionsDto {
  @ApiProperty({
    type: [String],
    description: 'Post ids that just became visible to the viewer.',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  public postIds: string[];
}
