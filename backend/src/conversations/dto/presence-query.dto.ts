import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class PresenceQueryDto {
  @ApiProperty({
    description: 'Comma-separated user ids or repeated userIds query params',
    type: [String],
    example: ['uuid-1', 'uuid-2'],
  })
  @Transform(({ value }: { value: unknown }): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
    }
    return [];
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  userIds: string[];
}
