import { Module } from '@nestjs/common';
import { TodosService } from './todo.service';
import { TodosController } from './todo.controller';
import { AuthModule } from '../auth/auth.module';
import { TodoRepository } from './todo.repository';

@Module({
  imports: [AuthModule],
  controllers: [TodosController],
  providers: [TodosService, TodoRepository],
})
export class TodosModule {}
