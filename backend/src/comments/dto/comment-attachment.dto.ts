import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentAttachmentResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public id: string;

  @ApiProperty({
    example:
      'http://localhost:8000/files/550e8400-e29b-41d4-a716-446655440000.png',
    format: 'uri',
  })
  public url: string;

  @ApiProperty({ example: 'photo.png' })
  public fileName: string;

  @ApiPropertyOptional({ example: 'image/png', nullable: true })
  public mimeType: string | null;

  @ApiPropertyOptional({ example: 245760, nullable: true })
  public sizeBytes: number | null;

  @ApiProperty({ example: '2026-07-11T12:00:00.000Z' })
  public createdAt: Date;
}
