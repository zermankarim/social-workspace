import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todo.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoQueryDto } from './dto/todo-query.dto';
import { PaginatedTodosResponseDto } from './dto/paginated-todos-response.dto';
import { type RequestWithJwtPayload } from '../shared/types/request-with-jwt-payload.type';

const TODO_ID_PARAM = {
  name: 'id',
  description: 'Todo UUID',
  example: '550e8400-e29b-41d4-a716-446655440000',
} as const;

@ApiTags('Todos')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({
    summary: 'List todos (paginated)',
    description:
      'Returns a paginated list of todos for the authenticated user. ' +
      'Supports `page`, `limit`, `sortBy` (`createdAt`, `updatedAt`) and `orderBy` (`asc`, `desc`). ' +
      'Defaults: page=1, limit=20, sortBy=createdAt, orderBy=desc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of todos',
    type: PaginatedTodosResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (page, limit, sortBy, orderBy)',
  })
  @Get()
  findPaginated(
    @Req() req: RequestWithJwtPayload,
    @Query() query: TodoQueryDto,
  ) {
    return this.todosService.findPaginated(req.user.userId, query);
  }

  @ApiOperation({
    summary: 'Get todo by id',
    description:
      'Returns a single todo with attachments. The todo must belong to the authenticated user.',
  })
  @ApiParam(TODO_ID_PARAM)
  @ApiResponse({
    status: 200,
    description: 'Todo found',
    type: TodoResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found or belongs to another user',
  })
  @Get(':id')
  findOne(@Req() req: RequestWithJwtPayload, @Param('id') id: string) {
    return this.todosService.findOne(req.user.userId, id);
  }

  @ApiOperation({
    summary: 'Create todo',
    description:
      'Creates a new todo for the authenticated user. Attachments can be added in the same request.',
  })
  @ApiResponse({
    status: 201,
    description: 'Todo created',
    type: TodoResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @Post()
  create(@Req() req: RequestWithJwtPayload, @Body() dto: CreateTodoDto) {
    return this.todosService.create(req.user.userId, dto);
  }

  @ApiOperation({
    summary: 'Update todo',
    description:
      'Partially updates a todo. Send only the fields you want to change: `text` and/or `completed`.',
  })
  @ApiParam(TODO_ID_PARAM)
  @ApiResponse({
    status: 200,
    description: 'Todo updated',
    type: TodoResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({
    description: 'Todo not found or belongs to another user',
  })
  @Patch(':id')
  update(
    @Req() req: RequestWithJwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todosService.update(req.user.userId, id, dto);
  }

  @ApiOperation({
    summary: 'Delete todo',
    description:
      'Permanently deletes a todo and all of its attachments (cascade).',
  })
  @ApiParam(TODO_ID_PARAM)
  @ApiResponse({ status: 204, description: 'Todo deleted' })
  @ApiNotFoundResponse({
    description: 'Todo not found or belongs to another user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Req() req: RequestWithJwtPayload, @Param('id') id: string) {
    return this.todosService.remove(req.user.userId, id);
  }
}
