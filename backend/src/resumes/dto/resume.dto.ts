import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({ example: 'John_Doe_Resume.pdf', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ example: 'https://storage.example.com/resumes/abc.pdf' })
  @IsUrl({ require_tld: false })
  fileUrl: string;

  @ApiProperty({ example: 245_000 })
  @IsInt()
  @Min(1)
  sizeBytes: number;
}

export class ResumeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'John_Doe_Resume.pdf' })
  fileName: string;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty({ example: 245_000 })
  sizeBytes: number;

  @ApiProperty()
  uploadedAt: Date;
}
