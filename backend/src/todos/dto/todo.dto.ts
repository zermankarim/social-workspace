import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';

export class CreateAttachmentDto {
  @ApiProperty({
    description: 'Public URL of the uploaded file',
    example: 'https://cdn.example.com/files/photo.png',
  })
  @IsUrl({ require_tld: false })
  url: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'photo.png',
  })
  @IsString()
  @MinLength(1)
  fileName: string;

  @ApiPropertyOptional({
    description: 'MIME type of the file',
    example: 'image/png',
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 245760,
  })
  @IsOptional()
  @IsInt()
  sizeBytes?: number;
}

export class CreateTodoDto {
  @ApiProperty({
    description: 'Todo text',
    example: 'Buy milk',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  text: string;

  @ApiPropertyOptional({
    type: [CreateAttachmentDto],
    description: 'Optional attachments to create together with the todo',
    example: [
      {
        url: 'https://cdn.example.com/files/photo.png',
        fileName: 'photo.png',
        mimeType: 'image/png',
        sizeBytes: 245760,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttachmentDto)
  attachments?: CreateAttachmentDto[];
}

export class UpdateTodoDto {
  @ApiPropertyOptional({
    description: 'Updated todo text',
    example: 'Buy milk and bread',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  text?: string;

  @ApiPropertyOptional({
    description: 'Mark todo as completed or reopen it',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

export class TodoResponseDto {
  @ApiProperty({
    description: 'Unique todo identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Todo text',
    example: 'Buy milk',
  })
  text: string;

  @ApiProperty({
    description: 'Whether the todo is completed',
    example: false,
  })
  completed: boolean;

  @ApiProperty({
    type: [AttachmentDto],
    description: 'Files attached to the todo',
  })
  attachments: AttachmentDto[];

  @ApiProperty({
    description: 'When the todo was created',
    example: '2026-07-04T20:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the todo was last updated',
    example: '2026-07-04T20:15:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
