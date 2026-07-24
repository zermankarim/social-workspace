import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostsService } from './posts.service';

/** Auto-publishes SCHEDULED posts once their `scheduledFor` time has passed. */
@Injectable()
export class PostSchedulerService {
  private readonly logger = new Logger(PostSchedulerService.name);

  constructor(private readonly postsService: PostsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handlePublishDuePosts(): Promise<void> {
    const count = await this.postsService.publishDuePosts();
    if (count > 0) {
      this.logger.log(`Published ${count} scheduled post(s)`);
    }
  }
}
