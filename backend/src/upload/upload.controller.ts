import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { AppConfigService } from '../infrastructure/config/services/config.service';

const ALLOWED_IMAGE_MIME = /^image\/(jpeg|png|webp|gif)$/;

@ApiTags('Upload')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly envConfig: AppConfigService,
  ) {}

  @ApiOperation({
    summary: 'Upload an image',
    description:
      'Uploads an image to Supabase Storage and returns a public URL with metadata. Reuse the response for user avatars, or any other feature that stores file URLs.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpeg, png, webp, gif)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded',
    type: UploadResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid file type or file too large',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<UploadResponseDto> {
    this.assertValidImage(file);
    return this.uploadService.saveImage(file);
  }

  private assertValidImage(
    file: Express.Multer.File | undefined,
  ): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const maxBytes = this.envConfig.upload.maxFileSizeBytes;
    if (file.size > maxBytes) {
      throw new BadRequestException(
        `File too large. Max size is ${maxBytes} bytes`,
      );
    }

    if (!ALLOWED_IMAGE_MIME.test(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: jpeg, png, webp, gif',
      );
    }
  }
}
