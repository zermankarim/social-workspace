import { Injectable, OnModuleInit } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { AppConfigService } from '../infrastructure/config/services/config.service';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly uploadDir: string;

  constructor(private readonly envConfig: AppConfigService) {
    this.uploadDir = join(process.cwd(), this.envConfig.upload.dir);
  }

  onModuleInit(): void {
    mkdirSync(this.uploadDir, { recursive: true });
  }

  get filesPath(): string {
    return this.uploadDir;
  }

  saveImage(file: Express.Multer.File): UploadResponseDto {
    const extension = extname(file.originalname).toLowerCase();
    const storedName = `${randomUUID()}${extension}`;
    const storedPath = join(this.uploadDir, storedName);

    writeFileSync(storedPath, file.buffer);

    const publicBase = this.envConfig.upload.publicUrl.replace(/\/$/, '');

    return {
      url: `${publicBase}/files/${storedName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    };
  }
}
