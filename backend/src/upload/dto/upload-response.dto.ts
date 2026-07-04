import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Public URL to access the uploaded file',
    example: 'http://localhost:8000/files/550e8400-e29b-41d4-a716-446655440000.png',
  })
  url: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'photo.png',
  })
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the uploaded file',
    example: 'image/png',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 245760,
  })
  sizeBytes: number;
}
