import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResumesService } from '../services/resumes.service';
import { CreateResumeDto, ResumeResponseDto } from '../dto/resume.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Resumes')
@Controller('resumes')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get('me')
  @ApiOperation({ summary: 'List my resumes (most recent first)' })
  @ApiOkResponse({ type: [ResumeResponseDto] })
  listMine(@Req() req: RequestWithJwtPayload): Promise<ResumeResponseDto[]> {
    return this.resumesService.listMine(req.user.userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Register an uploaded resume',
    description:
      'Call POST /upload/resume first to get a fileUrl, then register it here. Max 3 resumes kept per profile.',
  })
  @ApiCreatedResponse({ type: ResumeResponseDto })
  @ApiBadRequestResponse({ description: 'Already at the 3-resume limit' })
  createResume(
    @Req() req: RequestWithJwtPayload,
    @Body() body: CreateResumeDto,
  ): Promise<ResumeResponseDto> {
    return this.resumesService.createResume(req.user.userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one of my resumes' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Resume not found' })
  deleteResume(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.resumesService.deleteResume(req.user.userId, id);
  }
}
