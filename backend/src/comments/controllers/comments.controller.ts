import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
}
