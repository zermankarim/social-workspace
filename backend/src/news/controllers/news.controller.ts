import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NewsService } from '../services/news.service';
import {
  NewsStoryDetailResponseDto,
  NewsStoryResponseDto,
} from '../dto/news-story.dto';
import { CreateNewsStoryDto } from '../dto/create-news-story.dto';
import { NewsQueryDto } from '../dto/news-query.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ProfileRole } from '@prisma/client';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'List latest news stories' })
  @ApiOkResponse({ type: [NewsStoryResponseDto] })
  list(@Query() query: NewsQueryDto): Promise<NewsStoryResponseDto[]> {
    return this.newsService.list(query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an internal news story' })
  @ApiOkResponse({ type: NewsStoryDetailResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid news story id' })
  @ApiNotFoundResponse({ description: 'News story not found' })
  getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NewsStoryDetailResponseDto> {
    return this.newsService.getById(id);
  }

  @Post()
  @Roles(ProfileRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({
    summary: 'Create a news story (admin only)',
  })
  @ApiOkResponse({ type: NewsStoryDetailResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  create(
    @Body() body: CreateNewsStoryDto,
  ): Promise<NewsStoryDetailResponseDto> {
    return this.newsService.create(body);
  }

  @Post(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({
    summary: 'Register a read (increments readers count once per user)',
  })
  @ApiOkResponse({ type: NewsStoryResponseDto })
  @ApiNotFoundResponse({ description: 'News story not found' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  registerRead(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NewsStoryResponseDto> {
    return this.newsService.registerRead(id, req.user.userId);
  }
}
