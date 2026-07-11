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
    const originalName = this.decodeOriginalFileName(file.originalname);
    const extension = extname(originalName).toLowerCase();
    const storedName = `${randomUUID()}${extension}`;
    const storedPath = join(this.uploadDir, storedName);

    writeFileSync(storedPath, file.buffer);

    const publicBase = this.envConfig.upload.publicUrl.replace(/\/$/, '');

    return {
      url: `${publicBase}/files/${storedName}`,
      fileName: originalName,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    };
  }

  /**
   * Multer reads multipart filenames as Latin-1. Non-ASCII names (e.g. Cyrillic)
   * arrive mojibake'd ("Ð¼Ð°Ð¼Ð°.jpg") unless re-decoded as UTF-8.
   */
  private decodeOriginalFileName(originalName: string): string {
    const decoded = Buffer.from(originalName, 'latin1').toString('utf8');
    // Only accept the fix when it looks like a round-trip improvement.
    if (decoded.includes('\uFFFD')) {
      return originalName;
    }
    return decoded;
  }
}
