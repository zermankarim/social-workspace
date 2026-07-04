import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty({
    description: 'Unique attachment identifier',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Public URL of the uploaded file',
    example: 'https://cdn.example.com/files/photo.png',
  })
  url: string;

  @ApiProperty({
    description: 'Original file name shown in the UI',
    example: 'photo.png',
  })
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/png',
    required: false,
    nullable: true,
  })
  mimeType: string | null;

  @ApiProperty({
    description: 'File size in bytes',
    example: 245760,
    required: false,
    nullable: true,
  })
  sizeBytes: number | null;

  @ApiProperty({
    description: 'When the attachment was created',
    example: '2026-07-04T20:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}
