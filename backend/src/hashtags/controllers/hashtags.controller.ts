import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HashtagsService } from '../services/hashtags.service';
import { HashtagResponseDto } from '../dto/hashtag.dto';
import { HashtagSearchQueryDto } from '../dto/hashtag-search-query.dto';
import { PaginatedHashtagsResponseDto } from '../dto/paginated-hashtags-response.dto';
import { TrendingHashtagsQueryDto } from '../dto/trending-hashtags-query.dto';
import { PaginatedPostsResponseDto } from '../../posts/dto/paginated-posts-response.dto';
import { PostResponseDto } from '../../posts/dto/post.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';

@ApiTags('Hashtags')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('trending')
  @ApiOperation({
    summary: 'List trending hashtags',
    description: 'Hashtags ordered by number of posts, most used first.',
  })
  @ApiOkResponse({ type: [HashtagResponseDto] })
  getTrending(
    @Query() query: TrendingHashtagsQueryDto,
  ): Promise<HashtagResponseDto[]> {
    return this.hashtagsService.getTrending(query.limit ?? 5);
  }

  @Get()
  @ApiOperation({
    summary: 'Search hashtags (paginated)',
    description: 'Case-insensitive search; empty `q` returns trending order.',
  })
  @ApiOkResponse({ type: PaginatedHashtagsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  search(
    @Query() query: HashtagSearchQueryDto,
  ): Promise<PaginatedResponseDto<HashtagResponseDto>> {
    return this.hashtagsService.search(query);
  }

  @Get(':tag/posts')
  @ApiOperation({
    summary: 'List posts for a hashtag (paginated)',
    description: 'Newest first. `tag` may include or omit the leading #.',
  })
  @ApiOkResponse({ type: PaginatedPostsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  getPostsByTag(
    @Param('tag') tag: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    return this.hashtagsService.getPostsByTag(tag, query);
  }
}
