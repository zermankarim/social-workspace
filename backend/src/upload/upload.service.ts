import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import ws from 'ws';
import { AppConfigService } from '../infrastructure/config/services/config.service';
import { UploadResponseDto } from './dto/upload-response.dto';

type SupabaseStorageClient = ReturnType<typeof createClient>;

@Injectable()
export class UploadService implements OnModuleInit {
  private supabase!: SupabaseStorageClient;
  private bucket!: string;

  constructor(private readonly envConfig: AppConfigService) {}

  onModuleInit(): void {
    const { supabaseUrl, supabaseServiceRoleKey, supabaseStorageBucket } =
      this.envConfig.upload;

    // Node 20 has no global WebSocket; supabase-js Realtime needs `ws`.
    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        transport: ws as unknown as typeof WebSocket,
      },
    });
    this.bucket = supabaseStorageBucket;
  }

  async saveImage(file: Express.Multer.File): Promise<UploadResponseDto> {
    const originalName = this.decodeOriginalFileName(file.originalname);
    const extension = extname(originalName).toLowerCase();
    const storedName = `${randomUUID()}${extension}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(storedName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload file to storage: ${error.message}`,
      );
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(storedName);

    return {
      url: data.publicUrl,
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
